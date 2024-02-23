### U3 Monorepo 🚀
This is a monorepo containing code for the U3 project. U3 is a social app that integrates with multiple platforms like Lens and Farcaster.

#### Packages 📦
- `apps/u3` - The main U3 React application 🖥
- `packages/ui` - Shared React UI components 🎨
- `packages/config` - Configuration and environment variables ⚙️
- `packages/utils` - Shared utility functions 🛠
- `packages/social` - Social platform integrations 🤝
#### Getting Started ✨
To install dependencies:
```
yarn install --ignore-engines
```


#### Overview 👀
- The main U3 app code lives in apps/u3. This contains React components, hooks, utils, services etc.

- Shared code is organized into packages under packages/*. The main app imports these packages.

- Key folders in apps/u3/src:

  - components - React components 🖼
  - hooks - Custom hooks for logic ♻️
  - utils - Utility functions 🛠
  - services - API clients 📡
  - types - TypeScript types and interfaces 📜
  - services contains API clients that call backend APIs. 📡

#### Main Technologies 🛠
- React - UI library 📦
- TypeScript - For static typing ⌨️
- React Query - Data fetching and caching 📡
- React Router - Routing and navigation 🗺
- Tailwind CSS - Styling 🎨
- Lens Protocol/Farcaster
#### Social Integrations 🤝
The app integrates deeply with various social platforms:

- Lens Protocol - See src/hooks/social/lens and src/utils/social/lens. 🌐

- Farcaster - See src/components/social/farcaster and src/hooks/social/farcaster. 💬

These integrate via the platforms' JavaScript SDKs and custom React hooks. ♻️


#### License ⚖️
This project is licensed under the MIT license - see LICENSE for more details.

#### Contributing 🤝
See CONTRIBUTING.md to learn how to contribute to this project.