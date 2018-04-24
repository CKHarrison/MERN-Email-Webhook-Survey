const _ = require('lodash');
// path-parser changed to typescript so need to add default to the end of it
const Path = require('path-parser').default;
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

// Bringing in the Survey model
const Survey = mongoose.model('surveys');

module.exports = (app) => {
  // survey list dashboard
  app.get('/api/surveys', requireLogin, async (req, res) => {
    // find all the user's surveys and exclude the recipient list
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });

    res.send(surveys);
  });

  // survey redirect link
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  // webhook integration
  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    // this block is making sure we only take on response from one user
    _.chain(req.body)
      .map(({ email, url }) => {
        // will either be surveyId: whatever, and choice: whatever or null if nothing is found
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      // iterate through events and remove any that are undefined
      .compact()
      // iterate and remove any duplicates
      .uniqBy('email', 'surveyId')
      // updating mongo
      .each(({ surveyId, email, choice }) => {
        // find matching survey and update it
        // increment whatever choice they have by 1 -- [choice] can be yes or no es6 value syntax
        // update responded property to true
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
            //execute the query
          }
        ).exec();
      })
      .value();

    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      // spliting the string into an array seperated by commas, then mapping them
      // to an object with email: emailString, and triming off any extra whitespace
      recipients: recipients
        .split(',')
        .map((email) => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // Send Email
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      // save survey model
      await survey.save();
      // deduct credits
      req.user.credits -= 1;
      const user = await req.user.save();

      // making sure we send the updated user model and show the correct number of credits
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
