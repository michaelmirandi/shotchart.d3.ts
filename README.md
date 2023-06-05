# shotchart.d3.ts

This TypeScript library represents a sophisticated toolset for creating interactive basketball shot charts. It integrates the dynamic capabilities of d3.js, a widely-used JavaScript library for generating interactive data visualizations, with React, a leading JavaScript library for developing user interfaces. The goal is to deliver a highly customizable and interactive experience for basketball analytics.

The library employs Rollup, a modern JavaScript module bundler, for project building. Thanks to Rollup's capacity to create efficient and optimized bundles, the library remains lightweight, ensuring quick loading times and readiness for practical usage.

In addition, Storybook, an open-source tool for developing UI components in isolation, is used to provide detailed documentation and usage examples for each component. This offers comprehensive guidance on how to incorporate and use these components in various projects.

With a focus on user-friendliness, extensibility, and customization, this library can serve as a valuable tool for basketball enthusiasts, data scientists, or developers interested in sports analytics. It facilitates the creation of rich, interactive visualizations for basketball shot data.

## Codebase Structure

The codebase is structured as follows:

- components/: Houses the React components that are used to visualize the basketball court and shot charts.
- css/: Contains CSS files that are used for styling the basketball court and shot zones.
- lib/: Hosts various resources, including example data, interfaces, constants, and utility functions, that are used across to render the components.
- utilities/: Contains utility functions and types that are used in the project. This includes utilities specifically for building the storybook.

## Installation

```bash
npm install shotchart.d3.ts
```

## Usage

### `Halfcourt` Component

The `Halfcourt` component is a functional React component that displays an interactive, SVG-based halfcourt basketball diagram.

#### Importing the Component

Firstly, import the `Halfcourt` component in your file:

```jsx
import { Halfcourt } from "shotchart.d3.ts";
```

#### Component Props

The `Halfcourt` component takes in two props: `id` and `courtType`.

- `id` is a unique identifier (number) for the halfcourt diagram.
- `courtType` is a string that specifies the type of the basketball court. It can either be `"NBA"` or `"COLL"`.

Here's an example of how to use the `Halfcourt` component:

```jsx
<Halfcourt id={1} courtType="NBA" />
```

#### How It Works

On component mount and whenever the `courtType` prop changes, the `Halfcourt` component will first clear any existing SVG with the same `id`. It then calculates the settings for the court diagram based on the `courtType` prop (using either `NBA_SETTINGS` or `COLL_SETTINGS`), and then calls `drawCourt()` to draw the court lines on a new SVG element.

The `Halfcourt` component renders an SVG element with a width of 100% and an `id` based on the `id` prop. The SVG element has a `ref` attached to it, which is used to manipulate its contents in the `useEffect` hook.

### `ZonedShotchart` Component

The `ZonedShotchart` component is a robust visualization tool that renders a basketball shot chart in React. It offers an interactive visual display of different shooting zones on a basketball court, with an ability to customize the color theme and adjust to different court types.

#### Importing the Component

To use the `ZonedShotchart` component in your project, import it as follows:

```jsx
import { ZonedShotchart } from "shotchart.d3.ts";
```

The component depends on several utilities and constants which should be present in the relative paths provided in the import statements. Make sure these dependencies are available in your project.

#### Component Props

`ZonedShotchart` expects the following props:

- `id` (string): A unique identifier for the shot chart. This is used to create the `id` attribute of the SVG element that renders the shot chart.

- `courtType` (string): Specifies the type of the basketball court. It can be either "NBA" or "COLL".

- `theme` (string): Defines the color theme of the shot chart. It can be "B/O" for a blue/orange theme, or any other value will default to a red/green theme.

- `backgroundTheme` (string): Specifies the color theme of the background, particularly useful for styling zone labels with missing percentiles.

- `data` (object): Represents the data for the shots to be displayed on the shot chart.

Here's an example of how to use the `ZonedShotchart` component with props:

```jsx
<ZonedShotchart
  id="myShotchart"
  courtType="NBA"
  theme="B/O"
  backgroundTheme="light"
  data={shotData}
/>
```

#### How it works

Upon mounting, the `ZonedShotchart` component creates a shot chart by drawing the court lines and base with the `drawCourt()` function. It then creates different shot zones using `createSectionedZones()`, and labels the shot zones based on the provided `props.data` using `labelShotZones()`.

The shot chart colors and the background theme are determined by `props.theme` and `props.backgroundTheme`, respectively. The court size and dimensions are determined by `props.courtType`, which offers settings for both NBA and college courts.

This process is also triggered whenever `props.theme`, `props.backgroundTheme`, `props.data`, or `props.courtType` changes, ensuring the component remains up-to-date with any prop updates.

The `ZonedShotchart` component renders an SVG element with a width of 100% and an id based on `props.id`. The SVG element has a `ref` attached to it, which is used to manipulate its contents in the `useEffect` hook.

## Contributing to the Repository

### Prerequisites

Before you begin, make sure you have the following software installed on your local machine:

- [Node.js](https://nodejs.org/) (version 12 or above) and npm (version 6 or above)
- [Git](https://git-scm.com/)
- A text editor such as [VS Code](https://code.visualstudio.com/)

You should also have basic knowledge of React, TypeScript, Storybook, and Rollup.

### Getting Started

1. **Fork the repository.** Start by forking the repository to your GitHub account. You can do this by clicking the "Fork" button in the top right corner of the repository page.

2. **Clone the repository.** After forking, clone the repository to your local machine by running:

   ```
   git clone https://github.com/michaelmirandi/shotchart.d3.ts
   ```

3. **Install the dependencies.** Navigate into the cloned repository and install the necessary dependencies using npm:

   ```
   cd shotchart.d3.ts
   npm install
   ```

### Making Changes

1. **Create a branch.** Always create a new branch for your changes. Do not make changes directly on the main branch. You can create a new branch with:

   ```
   git checkout -b <branch-name>
   ```

2. **Write your code.** Make the necessary changes or additions to the code. Make sure your code adheres to the existing style guide and conventions. Remember to follow best practices for React and TypeScript programming.

3. **Check the Storybook.** If you have added or changed any components, make sure they are properly documented in the Storybook. You can run the Storybook locally with:

   ```
   npm run storybook
   ```

4. **Build the project.** Ensure that the project builds without errors. You can build the project using Rollup with the following command:

   ```
   npm run build
   ```

5. **Commit your changes.** After you have confirmed everything works, commit your changes. Please follow good commit message practices to ensure clear understanding of changes:

   ```
   git commit -m "Your detailed commit message"
   ```

### Submitting Changes

1. **Push your changes.** Push your changes to your forked repository:

   ```
   git push origin <branch-name>
   ```

2. **Create a Pull Request.** Go to your forked repository on GitHub and click on "New Pull Request". Select your branch from the dropdown and submit your pull request with a meaningful title and a detailed description of your changes.

### Additional Guidelines

- Please ensure your code is clean, efficient, and well-documented.
- If you're working on a large feature, consider breaking it down into smaller, manageable pull requests.
- If you're fixing a bug, please provide detailed steps to reproduce the bug in the pull request description.

## Upcoming Features

1. **Individual Shot Shotchart**: Visualize every shot as a single point.

2. **Hexbin Shotchart**: Group shots into hexagonal "bins" for a clearer view of shooting patterns and hotspots.

3. **Full-court charts with interactive players**: With player tracking data, this feature provides a dynamic, full-court visualization including player icons with additional information.
