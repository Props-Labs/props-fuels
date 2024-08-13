import { describe, it, expect } from 'vitest';
import { PropsContractManager } from './contract-manager';

describe('PropsContractManager', () => {
  it('should construct a PropsContractManager instance', () => {
    const contractManager = new PropsContractManager();
    expect(contractManager).toBeInstanceOf(PropsContractManager);
    expect(contractManager.events).toBeDefined();
  });
});
