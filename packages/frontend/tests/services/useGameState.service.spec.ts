import { useGameStateApi } from "@hooks/api/useGameState.api";
import { useLocalStorageStatic } from "@hooks/useLocalStorage";
import { useSyncQueue } from "@hooks/useSyncQueue";
import {
  ENERGY_KEY,
  PENDING_STATE_KEY,
  useGameStateService,
} from "@services/useGameState.service";
import type { FrontendGameState } from "@shared/src/interfaces";
import { PendingState } from "@src/contexts/GameData";
import useLogger from "@src/hooks/useLogger";
import { act, cleanup, renderHook } from "@testing-library/react";
import React from "react";

// Mock dependencies
jest.mock("@hooks/api/useGameState.api", () => ({
  useGameStateApi: jest.fn(),
}));
jest.mock("@hooks/useLocalStorage");
jest.mock("@hooks/useSyncQueue");
jest.mock("@hooks/useLogger");

describe("useGameStateService", () => {
  const mockGameState: FrontendGameState = {
    tapCount: 10,
    pointCount: 100,
    pointIncomePerSecond: 1,
    pointsPerTap: 1,
    maxEnergy: 150,
    energy: 100,
    energyRecoveryPerSecond: 1,
    level: 1,
    levelName: "Level 1",
    currentExp: 0,
    maxLevel: 100,
    lastSyncTime: new Date(),
    targetExp: 100,
    clientLogicState: {
      pointCountSynced: 90,
      clientClockStart: new Date(),
    },
  };

  let mockSync;

  const mockDispatch = jest.fn();
  const mockPendingState = { tapCountPending: 5 };
  const mockEmptyPendingState = { tapCountPending: 0 };

  let setLocalStorageMock;
  let getLocalStorageMock;

  beforeEach(() => {
    jest.clearAllMocks();

    setLocalStorageMock = jest.fn();
    getLocalStorageMock = jest.fn();

    mockSync = jest.fn().mockResolvedValue({ gameState: mockGameState });

    // Mock game state api
    (useGameStateApi as jest.Mock).mockReturnValue({
      sync: {
        mutateAsync: mockSync,
      },
    });

    // Mock pending state in localStorage
    (useLocalStorageStatic as jest.Mock).mockReturnValue({
      get: getLocalStorageMock.mockReturnValue(mockPendingState),
      set: setLocalStorageMock,
    });
    (useSyncQueue as jest.Mock).mockReturnValue(jest.fn((cb) => cb()));
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it("should initialize with correct properties and types", () => {
    const { result } = renderHook(() =>
      useGameStateService(mockGameState, mockDispatch),
    );

    expect(result.current).toEqual({
      startTimeout: expect.any(Function),
      syncWithServer: expect.any(Function),
      debouncedSync: expect.any(Function),
      pendingStateRef: expect.objectContaining({
        current: expect.any(Object),
      }),
    });

    expect(() => result.current.startTimeout()).not.toThrow();
    expect(() => result.current.syncWithServer()).not.toThrow();
    expect(() => result.current.debouncedSync()).not.toThrow();
  });

  it("should call syncWithServer on startup", async () => {
    await act(async () => {
      renderHook(() => useGameStateService(mockGameState, mockDispatch));
    });

    expect(mockSync).toHaveBeenCalledTimes(1);

    expect(mockSync).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockPendingState,
        clientCurrentPoints: mockGameState.pointCount,
      }),
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SYNC_GAME_STATE",
        payload: {
          gameState: mockGameState,
          pendingState: mockEmptyPendingState,
        },
      }),
    );
  });

  it("shouldn't call syncWithServer if there're no pending taps", async () => {
    // Remove pending tap count from localStorage mock
    (useLocalStorageStatic as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockReturnValue(mockEmptyPendingState),
      set: jest.fn(),
    });

    await act(async () => {
      renderHook(() => useGameStateService(mockGameState, mockDispatch));
    });

    expect(mockSync).not.toHaveBeenCalled();
  });

  it("should update game state on tick", async () => {
    const { result } = renderHook(() =>
      useGameStateService(mockGameState, mockDispatch),
    );

    // Start game loop
    await act(async () => {
      result.current.startTimeout();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "TICK",
        payload: { pointCount: expect.any(Number) },
      }),
    );
  });

  it("should reset pending state and restore it on sync failure", async () => {
    const setPendingStateMock = jest.fn();

    // Mock sync failure
    const syncError = new Error("Sync failed");
    (useGameStateApi as jest.Mock).mockReturnValue({
      sync: {
        mutateAsync: jest.fn().mockRejectedValue(syncError),
      },
    });

    // Update useLocalStorageStatic mock to use setPendingStateMock
    (useLocalStorageStatic as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(mockPendingState),
      set: setPendingStateMock,
    });

    // Prevent useEffect from running and syncing on startup
    jest.spyOn(React, "useEffect").mockImplementation((f) => f());

    // Mock logger
    const loggerErrorMock = jest.fn();
    (useLogger as jest.Mock).mockReturnValue({ error: loggerErrorMock });

    const { result } = renderHook(() =>
      useGameStateService(mockGameState, mockDispatch),
    );

    const newPendingState = { tapCountPending: 3 };

    // Simulate a change in pending state after initial render
    await act(async () => {
      result.current.pendingStateRef.current = newPendingState;
    });

    // Trigger sync
    await act(async () => {
      await result.current.syncWithServer();
    });

    expect(setPendingStateMock).toHaveBeenCalledWith({
      tapCountPending:
        mockPendingState.tapCountPending + newPendingState.tapCountPending,
    });

    // Verify error logging
    expect(loggerErrorMock).toHaveBeenCalledWith(
      "Failed to sync game state",
      syncError,
    );
  });

  it("should store energy and pending taps in localStorage on unmount and beforeunload", () => {
    // Mock Date.now
    jest.spyOn(global.Date, "now").mockImplementation(() => 1234567890);

    // Prevent syncing on startup
    (useSyncQueue as jest.Mock).mockReturnValue(jest.fn());

    const { result } = renderHook(() =>
      useGameStateService(mockGameState, mockDispatch),
    );

    // Simulate beforeunload event
    act(() => {
      result.current.pendingStateRef.current = mockPendingState;
      window.dispatchEvent(new Event("beforeunload"));
    });

    // Check if we store energy and pending taps in localStorage
    expect(setLocalStorageMock).toHaveBeenCalledWith({
      value: mockGameState.energy,
      lastSyncTime: 1234567890,
    });

    expect(setLocalStorageMock).toHaveBeenCalledWith(mockPendingState);
  });
});
