# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cricket Field Planner is a web application for designing cricket field formations. It allows users to drag and drop player positions, apply preset formations, analyze field effectiveness, and export field diagrams.

## Architecture

- **Frontend**: Vanilla JavaScript with CSS custom properties for theming
- **Structure**: Single-page application with modular class-based architecture
- **Main Class**: `CricketFieldPlanner` handles all application logic
- **Styling**: CSS-in-CSS approach with design system variables

## Core Files

- `index.html` - Main application structure with semantic markup
- `style.css` - Complete styling with responsive design and design system
- `app.js` - Application logic with drag-and-drop, formations, and analysis
- `readme.md` - Project documentation (currently minimal)

## Key Features

- Interactive cricket ground with draggable player positions
- Preset formations (attacking, defensive, spin bowling, etc.)
- Real-time field balance analysis (off-side vs leg-side)
- Field effectiveness scoring based on bowling conditions
- Export functionality to PNG images
- Save/load custom field formations
- Responsive design for mobile devices

## Development Commands

This is a static web application with no build process. Simply open `index.html` in a browser or serve via a local server.

## Mobile Compatibility

The application includes responsive breakpoints:
- Desktop: Full sidebar layout
- Tablet (1024px): Horizontal sidebar
- Mobile (768px): Compact layout
- Small mobile (480px): Minimal layout

## Cricket-Specific Logic

- Position detection based on angle and distance from center
- Field balance calculation (off-side vs leg-side)
- Formation effectiveness scoring
- Support for left/right-handed batsman orientation
- Various bowling type formations (fast, spin, death overs)

## Common Tasks

- **Adding new formations**: Update `initializePresetFormations()` method
- **Position detection**: Modify `detectPosition()` method  
- **Mobile layout**: Check responsive CSS breakpoints in style.css
- **Field analysis**: Update `calculateFieldEffectiveness()` method