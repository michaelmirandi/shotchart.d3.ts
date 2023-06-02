import * as React from "react";
import { ICourt } from "../../lib/halfcourt/Interfaces";
/**
 *

The `Halfcourt` component is a functional React component that provides a visual representation of a half court.

## Imports

The `Halfcourt` component imports several utility functions and constants:

- `SHOTCHART_SETTINGS`, `NBA_SETTINGS`, `COLL_SETTINGS`: Constants that represent different settings and dimensions for NBA and college basketball courts.
- `drawCourt()`: A utility function that draws the court lines on the SVG element.
- `ICourt`: An interface that defines the shape of the props that the `Halfcourt` component expects.

## Props

The `Halfcourt` component accepts the following props as defined by `ICourt` interface:

- `id`: A unique identifier for the half court.
- `courtType`: The type of the basketball court (either "NBA" or "COLL").

## Functionality

On component mount and whenever `props.courtType` changes, the `Halfcourt` component first removes any existing SVG with the same id. It then calculates the settings for the court diagram based on `props.courtType` (using either `NBA_SETTINGS` or `COLL_SETTINGS`), and then calls `drawCourt()` to draw the court lines on a new SVG element.

## Rendering

The `Halfcourt` component renders an SVG element with a width of 100% and an id based on `props.id`. The SVG element has a `ref` attached to it, which is used to manipulate its contents in the `useEffect` hook.

 */
export declare const Halfcourt: React.FC<ICourt>;
