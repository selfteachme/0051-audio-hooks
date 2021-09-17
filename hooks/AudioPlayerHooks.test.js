import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useAudioPlayer } from "./AudioPlayerHooks";

// 1) Meta data loads correctly:
// - comes from js api

// 2) Play / Pause

// 3) Forward / Backward

// 4) Arrange Slider / Jump to time

// 5) Range slider progresses as audio progresses

// 6) Pass in time and jump to it

describe("useAudioPlayer", () => {
  beforeEach(() => {
    jest.spyOn(window, "requestAnimationFrame");
  });

  afterEach(() => {
    window.requestAnimationFrame.mockRestore();
  });

  const defaultProps = {
    audioPlayer: {
      current: {
        currentTime: 0,
        duration: 100,
        pause: jest.fn(),
        play: jest.fn(),
      },
    },
    progressBar: {
      current: {
        max: 100,
        style: {
          setProperty: jest.fn(),
        },
        value: 0,
      },
    },
    animationRef: {
      current: {},
    },
  };

  const render = (overrides) =>
    renderHook((props) => useAudioPlayer(props), {
      initialProps: {
        ...defaultProps,
        ...overrides,
      },
    });

  test("Meta data loads correctly", async () => {
    const { result, waitFor } = render();

    waitFor(() => {
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(100);
    });
  });

  test("play", () => {
    const { result } = render();

    result.current.play();

    expect(defaultProps.audioPlayer.current.play).toHaveBeenCalled();
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  // TODO: Test pause and cancelAnimationFrame
  test("togglePlayPause", () => {
    const { result, waitFor } = render();

    expect(result.current.isPlaying).toBe(false);

    result.current.togglePlayPause();

    waitFor(() => {
      expect(result.current.isPlaying).toBe(true);
    });
  });

  test("timeTravel", () => {
    const { result, waitFor } = render();

    waitFor(() => {
      result.current.timeTravel(50);

      expect(defaultProps.progressBar.current.value).toBe(50);
      expect(defaultProps.audioPlayer.current.currentTime).toBe(50);
      expect(
        defaultProps.progressBar.current.style.setProperty
      ).toHaveBeenCalled();

      expect(result.current.currentTime).toBe(50);
    });
  });

  test("changeRange", () => {
    const { result } = render();

    defaultProps.progressBar.current.value = 1000;

    result.current.changeRange();

    expect(defaultProps.audioPlayer.current.currentTime).toBe(1000);
    expect(result.current.currentTime).toBe(1000);
    expect(
      defaultProps.progressBar.current.style.setProperty
    ).toHaveBeenCalled();
  });

  // TODO: Fix up this test
  // test.only("setTimeJump", () => {
  //   const { result, waitFor } = render();

  //   result.current.setTimeJump(10);

  //   waitFor(() => {
  //     expect(defaultProps.progressBar.current.value).toBe(50);
  //     expect(result.current.currentTime).toBe(10);
  //   });
  // });

  // TODO: Add describe and test more branching to improve coverage
  describe("calculateTime", () => {
    test.each([
      [120, "02:00"],
      [60 * 20, "20:00"],
      [60, "01:00"],
      [30, "00:30"],
    ])("when provided %is", (input, expected) => {
      const { result } = render();

      expect(result.current.calculateTime(input)).toBe(expected);
    });
  });

  test("forwardThirty", () => {
    const { result, waitFor } = render();

    result.current.forwardThirty();

    waitFor(() => {
      expect(result.current.currentTime).toBe(30);
    });
  });

  test("backThirty", () => {
    const { result, waitFor } = render();

    result.current.backThirty();

    waitFor(() => {
      expect(result.current.currentTime).toBe(0);
    });
  });
});
