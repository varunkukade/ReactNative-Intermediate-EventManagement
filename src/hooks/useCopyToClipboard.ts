import { useState, useCallback, useEffect } from 'react';
import { Platform, ToastAndroid } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

type UseCopyToClipboard = [boolean, (text: string | number) => void];

export default function useCopyToClipboard(
  resetInterval: null | number = null,
): UseCopyToClipboard {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timerId: number | null = null;

    if (isCopied && resetInterval) {
      //after resetInterval, reset the isCopied.
      timerId = setTimeout(() => {
        setIsCopied(false);
      }, resetInterval);
    }

    return () => {
      //remove timer while unmounting
      if (timerId) clearInterval(timerId);
    };
  }, [isCopied, resetInterval]);

  const setCopiedText = useCallback((text: string | number) => {
    if (typeof text === 'string' || typeof text === 'number') {
      Clipboard.setString(text.toString());
      setIsCopied(true);
      if (Platform.OS === 'android')
        ToastAndroid.show('Copied to clipboard.', ToastAndroid.SHORT);
    } else {
      setIsCopied(false);
      if (Platform.OS === 'android')
        ToastAndroid.show(
          'Cannot copy other than string or number.',
          ToastAndroid.SHORT,
        );
    }
  }, []);

  return [isCopied, setCopiedText];
}
