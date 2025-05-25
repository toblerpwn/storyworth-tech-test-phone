<p align="left">
  <img src="https://storyworth-tech-test-phone.vercel.app/assets/laptop-typing.png" alt="Storyworth Logo" width="300" />
</p>

This is [Sean Conrad's](https://www.linkedin.com/in/seanconrad83) project for Storyworth. Of the project choices provided, this project was chosen:

> **Project 1: Voice recordings**
>
> Some Storyworth Memoir storytellers do not take to typing their stories, whether because they are uncomfortable with technology or because they are better speakers than writers. We want to add a feature to let storytellers record a story by phone.
>
> The storyteller will see a landing page that asks them to enter their phone number (design in Figma below).
>
> Upon submitting their phone number, the storyteller should receive an automated call asking them to record a story.
>
> Once they’ve recorded their story, they should be redirected to a page with an audio player to listen to their recording.

## Architecture

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). Next is a web framework built on [React](https://react.dev/). Next also provides convenient capabilities for API construction, including [handling webhooks](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#webhooks).

[Twilio](https://twilio.com) is used for its [Voice API](https://www.twilio.com/docs/voice), including [outgoing phone calls](https://www.twilio.com/docs/voice/tutorials/how-to-make-outbound-phone-calls), [recording](https://www.twilio.com/docs/voice/tutorials/how-to-record-phone-calls), and [transcription](https://www.twilio.com/docs/voice/api/recording-transcription) capabilities.

[Firebase](https://firebase.google.com/) is used for [Authentication](https://firebase.google.com/docs/auth) (anonymous, durable user session) and [Cloud Firestore](https://firebase.google.com/docs/firestore) (document store with lots of sugar and easy client sync/subscription capabilities).

The application is hosted on Vercel here: https://storyworth-tech-test-phone.vercel.app/

### Data Flow (Sketch)

<img src="https://github.com/user-attachments/assets/b8be6f19-49de-4a78-8cc8-6c6899f5d1f0" width=600>

1. React App ("App") renders page (using Next.js routing and other framework sugar).
2. App validates Auth session; logs in w/ anonymous (persistent) session if needed.
3. App retrieves (or creates) `User` doc via Firestore DB. App checks the `User` doc for an `activeCall` value; if present, App UI is updated to reflect the `Call`'s status.
4. If no valid active `Call` is found, the user can request a call from the App.
5. Upon request, Twilio makes an outbound call to the user-entered phone number.
6. Twilio sends callbacks on call status changes (e.g. `ringing`, `in-progress`, `completed`, etc) via webhook to our Next.js Web API routes. After the call is complete, separate callbacks hit our API for call Recordings and a Transcripts.
7. Based on the incoming data we receive via API/webhook, we update the database. The App is listening for changes via Firestore's local client/server sync. App UI is stateful; based purely on incoming state (no diffs needed).

## Getting Started

First, run `npm i` to install dependencies, then open the project. run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### VSCode Tasks

If you are using VSCode, both `ngrok` and the dev server will be started automatically at startup, and run in VSCode's terminal.

See `.vscode/tasks.json` for full configuration.

### Making Calls

Twilio requires three env vars to work properly, which we have placed in `.env` locally (prod secrets are handled by Vercel):

```env
TWILIO_PHONE_NUMBER=[phone_number_you_bought_from_twilio]
TWILIO_API_KEY_SID=[twilio_api_key_sid]
TWILIO_API_KEY_SECRET=[twilio_api_secret_SENSITIVE]
```

For actual values (including sensitive secrets), contact [@toblerpwn](https://github.com/toblerpwn), or insert your own from your Twilio account (it should work just fine, but this has not been tested).

#### Handling call status updates (webhooks)

The application uses Twilio's webhooks to update a call's status (e.g. queued, ringing, in-progress, completed). This cannot easily be mocked, so in practical terms you will need to expose `localhost:3000` to the open web to receive Twilio's webhook/callback updates and work on anything related to the phone call functionality.

For the purposes of this demo, I used a service called [ngrok](https://ngrok.com/) for this. Here are the exact steps:

1. Install [ngrok](https://ngrok.com/) (I used the `brew` method).
2. If you didn't already start the proxy as part of setup, run `ngrok http http://localhost:3000`
3. Copy/paste the public forwarding URL from `ngrok`. It will look something like this: ` https://{uuid}.ngrok-free.app`
4. Paste it in to your local `.env` file as the value for `NGROK_PUBLIC_URL`, e.g.:

```.env
...
NGROK_PUBLIC_URL=https://f8a8-97-120-252-235.ngrok-free.app
```

## Contributing

- This project uses `gitmoji` https://gitmoji.dev/ for easy-to-scan commit messages

## Deploying to Production

Pushing to the origin (Github) repo will automatically deploy code changes to production @ https://storyworth-tech-test-phone.vercel.app/
