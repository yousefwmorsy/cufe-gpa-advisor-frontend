
# Advanced GPA Advisor Frontend (Angular)

This is the Angular frontend for the Advanced GPA Advisor web application.

## Core Functionality

- **Transcript Parsing:** Upload or paste your transcript text and have it automatically parsed into structured terms and courses using local regex logic.
- **GPA Calculation:** Instantly view your current term and cumulative GPA, with support for custom grading scales.
- **Simulation:** Plan future terms and courses, set a target GPA, and simulate possible scenarios to see if your goals are achievable.
- **Insights Dashboard:** Visualize GPA trends, identify best and worst performing courses, and get actionable insights.
- **AI Advisor Chat:** Ask questions and get personalized academic advice powered by AI, based on your transcript and goals.
- **Local-First Experience:** All transcript data and simulations are managed in-browser for privacy and speed. Save/load scenarios as needed.
- **Modern UI:** Responsive dark theme built with TailwindCSS for a sleek, accessible experience.

## Getting Started

1. Install dependencies:
	```bash
	npm install
	```
2. Start the development server:
	```bash
	ng serve
	```

## Testing

To run unit tests with [Karma](https://karma-runner.github.io):

```bash
ng test
```

## End-to-End Testing

For e2e tests:

```bash
ng e2e
```

Angular CLI does not include an e2e framework by default; you may choose one that fits your workflow.

## Resources

For more on Angular CLI, see the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
