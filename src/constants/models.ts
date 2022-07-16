import {
  ActionCases,
  ToolNames,
  ExpandButtonInnerText,
  positionOptions,
  flowOptions,
} from './enums';

export interface ToolsListOption {
  name: ToolNames;
  icon: string;
}

export interface ContentsNode {
  name: string;
  id: string;
  data: MediaData[];
  children: ContentsNode[];
  isExpanded?: boolean;
}

export type MediaData = {
  index: number;
  type: ToolNames;
  src: string;
  name?: string;
  styling?: Styling;
};

export interface DropInfo {
  targetId: string;
  action: ActionCases;
}

export interface Lookup {
  [key: string]: ContentsNode;
}

type ExpandKey = 'open' | 'close';
type ExpandButtonInfo = Record<ExpandKey, ExpandButtonInnerText>;

export interface ExpandButtonState {
  expanded: boolean;
  text: ExpandButtonInfo;
}

export interface deliveredNodeInfo {
  nodeToFind: ContentsNode;
  previousNodeId: string | undefined;
  nextNodeId: string | undefined;
}

export interface newToolInfo {
  tool: ToolNames;
  fileData?: string;
}

export interface Styling {
  currentPositionX: positionOptions;
  currentPositionY: positionOptions;
  currentFlow: flowOptions;
}

export interface imageDescription {
  index: number;
  src: string;
  width: number;
}
