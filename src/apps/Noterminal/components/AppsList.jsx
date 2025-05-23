import TerminalSettingsEditor from '../apps/TerminalSettingsEditor/TerminalSettingsEditor';

export const apps = [
  {
    name: "Terminal Settings Editor",
    description: "Edit terminal font, color, and design settings.",
    commands: ["terminal settings editor", "tse"],
    component: TerminalSettingsEditor,
  },
];
