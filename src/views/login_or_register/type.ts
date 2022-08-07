import { TRule } from '@/utils/validator';

interface TTriggerRule extends TRule {
  trigger: 'blur' | 'focus' | 'input' | 'change';
}

export type { TRule, TTriggerRule };
