# AtlasSync Questionnaire App

A modern, interactive questionnaire application built with React and Material-UI, designed for screening and evaluating candidates or customers for the AtlasSync project.

## Features

### 1. Questionnaire Builder
- **Multiple Question Types**
  - Text input
  - Single choice (radio buttons)
  - Multiple choice (checkboxes)
  - Rating scale (1-5)
  - Ranking criteria
- **Question Management**
  - Add/Edit/Delete questions
  - Drag-and-drop reordering
  - Required/Optional toggle
  - Question descriptions
- **Question Categories**
  - Business Screeners
  - Customer Questions
  - Decision Maker Questions

### 2. Cover Screen
- Project overview and description
- Key highlights and features
- AI-powered chat assistant
- Accept/Decline options
- Personalized candidate fit analysis

### 3. AI Chat Assistant
- Real-time chat interface
- Project-specific information
- Screening process guidance
- Integration with OpenRouter AI API

### 4. User Interface
- **Theme Support**
  - Light/Dark mode toggle
  - Responsive design
  - Modern Material-UI components
- **Navigation**
  - Progress tracking
  - Back/Next navigation
  - Question counter

### 5. Response Management
- Answer validation
- Progress saving
- Submission handling
- Thank you page

## Action Items (Planned Features)

### Enhanced Question Builder Interface
- **Question Creation Options** (COMPLETE)
  - [x] Sidebar is always visible on the left
  - [x] Sidebar shows all angles as tabs/sections (Business, Customer, Decision Maker)
  - [x] Each angle lists its questions (icon, number, truncated title)
  - [x] Clicking a question selects it for editing/preview in the main area
  - [x] If an angle has no questions, show:
    - [x] Message: "No questions yet for this angle."
    - [x] Three creation options:
      - [x] Create from Scratch
      - [x] Use a Question Set
      - [x] Write With AI (Main POC Focus)
  - [x] Sidebar and angle tabs must always be visible

### AI-Powered Question Generation
- **Part 1: Bulk Question Generation**
  - NLP Input with Project Context
  - Smart Question Type Selection
  - Plan/Revise Interface
  - Loading State with Status Updates
  - Preview and Edit Mode Integration

- **Part 2: Individual Question Enhancement**
  - **2a: Question Rewrite**
    - AI-powered question rewriting
    - Context-aware generation
    - Revert functionality
  - **2b: Suggested Questions**
    - AI-generated question suggestions
    - Multiple preview options
    - Easy integration into form

### Implementation Details
- Integration with OpenRouter Meta Llama API
- Question type support for:
  - Multiple choice
  - Long answer
  - Matrix
  - Ranking
  - NPS
- Smart context awareness using:
  - Project context
  - Existing questions
  - Question type
  - User intent

*Note: These features will be moved to the main Features section once completed and approved.*

## Technical Stack

- **Frontend Framework**: React
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context
- **Drag and Drop**: @hello-pangea/dnd
- **AI Integration**: OpenRouter AI API
- **Styling**: MUI's styled components
- **TypeScript**: For type safety

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── QuestionBuilder.tsx    # Main questionnaire builder
│   │   ├── QuestionInput.tsx      # Question input components
│   │   ├── CoverScreen.tsx        # Cover screen with AI chat
│   │   └── ThankYouPage.tsx       # Submission confirmation
│   ├── context/
│   │   └── QuestionnaireContext.tsx  # State management
│   ├── types/
│   │   └── question.ts            # TypeScript interfaces
│   └── App.tsx                    # Root component
```

## Revision History

### Version 1.0.0 (2024-03-21)
- Initial release
- Basic questionnaire functionality
- AI chat integration
- Dark mode support
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
