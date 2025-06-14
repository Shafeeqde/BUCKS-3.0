# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running Locally

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```
    This will typically start the app on `http://localhost:9002`.

## Deployment (Sharing with Friends)

To share this app with others, you need to deploy it. Firebase App Hosting is the recommended way.

1.  **Install Firebase CLI** (if you haven't already):
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**:
    ```bash
    firebase login
    ```
    Follow the prompts to log in with your Google account.

3.  **Target your Firebase Project**:
    Ensure your CLI is connected to the correct Firebase project. If you have multiple projects, you can list them with `firebase projects:list` and set the active project with `firebase use <your-project-id>`.

4.  **Deploy to Firebase App Hosting**:
    ```bash
    firebase deploy --only apphosting
    ```
    If prompted, select the App Hosting backend you want to deploy to.

5.  **Share the URL**:
    After successful deployment, the Firebase CLI will provide you with a Hosting URL (e.g., `https://your-project-id.web.app` or similar). Share this URL with your friends!

For more detailed information, refer to the [Firebase App Hosting documentation](https://firebase.google.com/docs/app-hosting).

