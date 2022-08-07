import { TRule } from '@/utils/validator';

type TTrigger = 'blur' | 'focus' | 'input' | 'change';

interface TTriggerRule extends TRule {
  trigger: TTrigger;
}

export type { TRule, TTrigger, TTriggerRule };
