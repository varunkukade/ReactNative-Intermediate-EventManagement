import { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';

type UseIsKeyboardShown = [boolean];

export default function useIsKeyboardShown(): UseIsKeyboardShown {
  const [isKeyboardOpened, setIsKeyboardOpened] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpened(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpened(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return [isKeyboardOpened];
}
