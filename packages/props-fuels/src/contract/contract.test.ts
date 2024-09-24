import { PropsContract } from './contract';
import { Props721EditionContract } from '../sway-api/contracts';
import { Account } from 'fuels';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('PropsContract', () => {
  let contract: PropsContract;
  let mockContract: Props721EditionContract;
  let mockAccount: Account;

  beforeEach(() => {
    mockContract = {
      functions: {
        set_merkle: vi.fn().mockReturnValue({
          call: vi.fn(),
        }),
        merkle_uri: vi.fn().mockReturnThis(),
        get: vi.fn().mockResolvedValue({ value: 'ipfs://mockuri' }),
        total_assets: vi.fn().mockReturnThis(),
        max_supply: vi.fn().mockReturnThis(),
      },
    } as unknown as Props721EditionContract;

    mockAccount = {
      provider: {
        getBaseAssetId: vi.fn().mockReturnValue('mockBaseAssetId'),
      },
    } as unknown as Account;

    contract = new PropsContract('mockId', mockContract, mockAccount);
  });
  

  it('should set allowlist', async () => {
    await contract.setAllowlist('mockRoot', 'mockUri');
    expect(mockContract.functions.set_merkle).toHaveBeenCalledWith('mockRoot', 'mockUri');
    expect(
      mockContract.functions.set_merkle("mockRoot", "mockUri").call
    ).toHaveBeenCalled();
  });

  it('should throw error if contract or account is not connected when setting allowlist', async () => {
    contract = new PropsContract('mockId');
    await expect(contract.setAllowlist('mockRoot', 'mockUri')).rejects.toThrow('Contract or account is not connected');
  });

  it('should get total assets', async () => {
    mockContract.functions.total_assets = vi.fn().mockReturnThis();
    mockContract.functions.total_assets().get = vi.fn().mockResolvedValue({ value: 100 });

    const totalAssets = await contract.getTotalAssets();
    expect(totalAssets).toBe(100);
    expect(mockContract.functions.total_assets().get).toHaveBeenCalled();
  });

  it('should throw error if contract is not connected when getting total assets', async () => {
    contract = new PropsContract('mockId');
    await expect(contract.getTotalAssets()).rejects.toThrow('Contract is not connected');
  });

  it('should get max supply', async () => {
    mockContract.functions.max_supply = vi.fn().mockReturnThis();
    mockContract.functions.max_supply().get = vi.fn().mockResolvedValue({ value: 1000 });

    const maxSupply = await contract.getMaxSupply();
    expect(maxSupply).toBe(1000);
    expect(mockContract.functions.max_supply().get).toHaveBeenCalled();
  });

  it('should throw error if contract is not connected when getting max supply', async () => {
    contract = new PropsContract('mockId');
    await expect(contract.getMaxSupply()).rejects.toThrow('Contract is not connected');
  });

//   it('should get allowlist allocation by address', async () => {
//     global.fetch = vi.fn().mockResolvedValue({
//       ok: true,
//       json: vi.fn().mockResolvedValue({
//         'mockAddress': { amount: 10 },
//       }),
//     });

//     const allocation = await contract.getAllowlistAllocationByAddress('mockAddress');
//     expect(allocation).toBe(10);
//   });

//   it('should throw error if contract or account is not connected when getting allowlist allocation', async () => {
//     contract = new PropsContract('mockId');
//     await expect(contract.getAllowlistAllocationByAddress('mockAddress')).rejects.toThrow('Contract or account is not connected');
//   });

//   it('should throw error if merkle URI is not found', async () => {
//     // @ts-ignore
//     mockContract.functions.get = vi.fn().mockResolvedValue({ value: null });
//     await expect(contract.getAllowlistAllocationByAddress('mockAddress')).rejects.toThrow('Merkle URI not found');
//   });

//   it('should throw error if fetching allowlist fails', async () => {
//     global.fetch = vi.fn().mockResolvedValue({
//       ok: false,
//     });

//     await expect(contract.getAllowlistAllocationByAddress('mockAddress')).rejects.toThrow('Failed to fetch allowlist from URI: https://ipfs.io/ipfs/mockuri');
//   });

//   it('should throw error if address is not found in allowlist', async () => {
//     global.fetch = vi.fn().mockResolvedValue({
//       ok: true,
//       json: vi.fn().mockResolvedValue({}),
//     });

//     await expect(contract.getAllowlistAllocationByAddress('mockAddress')).rejects.toThrow('Address mockAddress not found in allowlist');
//   });
});