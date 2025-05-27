# 🤖 Aurorion Teams Management App

A dynamic team management application for configuring AI agent teams across different projects and repositories.

## 🎯 Project Overview

This application allows users to:
- Create and manage multiple project repositories
- Configure AI agent teams with specialized roles
- Customize agent behavior per project
- Switch between Professional and "Price is Right" themes
- Export/import team configurations

## 🛠️ Tech Stack

- **Frontend**: Astro + TypeScript + MDX
- **Styling**: CSS Variables + Animations
- **Data**: localStorage (with export/import)
- **State**: Vanilla TypeScript (keeping it simple)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── layouts/            # Page layouts
├── pages/              # Astro pages
├── data/               # Static data and configurations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and themes
```

## 🎨 Themes

### Professional Theme
- Clean, corporate aesthetic
- Muted colors and minimal animations
- Focus on functionality and clarity

### Price is Right Theme
- Bright, game-show inspired design
- Animated elements and celebrations
- Fun, energetic user experience

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 📈 Development Timeline

### **Day 1 Progress** 🚀

**Morning Session (9:00 AM - 12:30 PM):**
- ✅ **Project Setup & Architecture** - Astro + TypeScript + MDX foundation
- ✅ **Base Layout with Theme Switcher** - Professional ↔ Price is Right themes
- ✅ **Repository Management System** - Complete CRUD functionality
  - ✅ Repository Creation Modal with full validation
  - ✅ Repository Cards with actions and status indicators
  - ✅ Repository List with search, filtering, and sorting
  - ✅ LocalStorage integration with error handling
- ✅ **Data Persistence** - Robust localStorage system with versioning

**Lunch Break (12:30 PM - 1:00 PM):** 
- 🔄 **Documentation Updates** - Comprehensive progress tracking

**Afternoon Session (1:00 PM - 7:00 PM):**
- 🔄 **Team Configuration Interface** - Agent role selection and customization
- 🔄 **Advanced Features** - Templates, export/import, animations
- 🔄 **Polish & Testing** - Final testing and demo preparation

### **Completed Features ✅**
- 🎨 **Dual Theme System** - Professional + Price is Right with celebrations
- 📦 **Repository Management** - Full CRUD with search/filter
- 💾 **Data Persistence** - LocalStorage with backup/restore capabilities
- 🔒 **Form Validation** - Comprehensive error handling and UX
- ♿ **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- 📱 **Responsive Design** - Mobile-first with progressive enhancement

## 🤖 Agent Roles

The app manages 7 specialized AI agent roles:
1. **Architect-Engineer** - System design and implementation
2. **Tester-Reviewer** - Quality assurance and standards
3. **Optimizer-Watchdog** - Performance and risk management
4. **Scrum-Knowledge** - Workflow and documentation
5. **Morale-Catalyst** - Team health and motivation
6. **Technical Enablement** - Infrastructure and tooling
7. **Standup Facilitator** - Meeting orchestration

## 📝 Documentation Standards

Every component includes:
- Purpose and functionality description
- Props/parameters documentation
- Usage examples
- Theme compatibility notes

---

*Built with ❤️ by the Aurorion Teams collective*