# Interactive Chat Component

This document provides information about the interactive chat component implemented for the DevTone website.

## Overview

The Interactive Chat is a professional, friendly chatbox that helps clients with information about the website, services, and contact details. It's designed to be visually appealing with animations and a consistent color scheme matching the website's purple theme.

## Features

- **Interactive Chat Interface**: Provides a modern chat experience with user and bot messages
- **Quick Action Buttons**: Allows users to quickly ask common questions
- **Service Information**: Provides details about the services offered
- **Contact Information**: Offers ways to contact the company
- **Social Media Integration**: Links to social media profiles
- **Responsive Design**: Works well on both desktop and mobile devices
- **Smooth Animations**: Includes various animations for a polished user experience

## Implementation Details

### Files

- `src/components/InteractiveChat.tsx`: Main component file
- `src/styles/chat-animations.css`: CSS animations for the chat component

### Integration

The chat component is integrated into the main application in `src/App.tsx` and appears on all pages of the website.

### Animations

The component includes several animations:
- Pulse effect on the chat button
- Floating animation for the chat window
- Slide-in animations for messages
- Typing indicator animation
- Hover effects on buttons and links

### Customization

The chat component can be easily customized:
- Update the `websiteInfo` object in `InteractiveChat.tsx` to change services, social media links, or contact information
- Modify the CSS in `chat-animations.css` to change animation styles
- Adjust the message processing logic in the `processMessage` function to handle different types of queries

## Usage

The chat component is automatically included on all pages. Users can:
1. Click the chat button in the bottom-right corner to open the chat
2. Type questions or use the quick action buttons
3. Receive responses with relevant information and links
4. Click on links to navigate to specific pages
5. Minimize or close the chat as needed

## Future Enhancements

Potential improvements for the chat component:
- Integration with a backend API for more dynamic responses
- User session persistence to remember conversations
- File upload capabilities for sharing documents
- Integration with a live chat system for agent handoff
- Analytics to track common questions and improve responses

## Support

For any issues or questions about the chat component, please contact the development team.