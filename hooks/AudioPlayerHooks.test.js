import { renderHook } from '@testing-library/react-hooks';
import { useAudioPlayer } from "./AudioPlayerHooks";

describe('useAudioPlayer', () => {
  test('renders the hook', () => {
    const { result } = renderHook(() => useAudioPlayer());

    console.log(">>> Hook Result", result);

    expect(result.current).toBe("???");
  });


  test.todo('sets the total length of clip');
  test.todo('handles time jumps');

  describe('when at the end', () => {
    test.todo('jumps back to beginning');
  });
});


