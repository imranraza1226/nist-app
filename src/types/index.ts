export type Framework = 'csf2' | 'sp80053' | 'sp800171';

export type CSFFunction =
  | 'Govern'
  | 'Identify'
  | 'Protect'
  | 'Detect'
  | 'Respond'
  | 'Recover';

export interface Control {
  id: number;
  control_id: string;
  title: string;
  description: string;
  implementation_guidance: string;
  framework: Framework;
  function_category: string;
  family: string;
  related_controls: string[];
  tags: string[];
}

export interface Bookmark {
  id: number;
  control_id: string;
  note: string;
  created_at: string;
  control?: Control;
}

export interface FrameworkInfo {
  id: Framework;
  name: string;
  shortName: string;
  description: string;
  color: string;
  icon: string;
  families: FamilyGroup[];
}

export interface FamilyGroup {
  name: string;
  controls: Control[];
}

export type RootStackParamList = {
  '(tabs)': undefined;
  'control-detail': { controlId: string };
};

export type TabParamList = {
  index: undefined;
  search: undefined;
  bookmarks: undefined;
};
