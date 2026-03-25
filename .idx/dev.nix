# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_22
  ];
  # Sets environment variables in the workspace
  env = {
    VITE_FIREBASE_API_KEY="AIzaSyCt8PzMzZXnw-ATL3VsmiVtZj1pXEwnK9Y";
    VITE_FIREBASE_AUTH_DOMAIN="pdfile-83911832-94d65.firebaseapp.com";
    VITE_FIREBASE_PROJECT_ID="pdfile-83911832-94d65";
    VITE_FIREBASE_STORAGE_BUCKET="pdfile-83911832-94d65.firebasestorage.app";
    VITE_FIREBASE_MESSAGING_SENDER_ID="744590200832";
    VITE_FIREBASE_APP_ID="1:744590200832:web:f9e2066c9e4c6ba24148e5";

    VITE_GEMINI_API_KEY = "AIzaSyD4Yhg8NaCwp9vr40ZuAz7kkfrcdRoUCFo";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "google.gemini-cli-vscode-ide-companion"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm i --no-audit --no-progress --timing";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [ "src/App.tsx" "src/App.ts" "src/App.jsx" "src/App.js" ];
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
