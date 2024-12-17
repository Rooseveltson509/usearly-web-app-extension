/* import { openFeedbackForm, openFeedbackWithEmojiSelection } from "../content/ContentScript";

export function handleAction(action: string, onCaptureClick: () => void, extraData?: any): void {
  if (!action) {
    console.warn('[handleAction] Action est vide ou non définie.');
    return;
  }

  console.log(`[handleAction] Déclenchement de l'action : ${action}`);

  switch (action) {
    case 'cheart':
      openFeedbackForm(extraData?.screenshot || '', 'cheart');
      break;

    case 'capture':
      onCaptureClick();
      break;

    case 'suggestion':
      openFeedbackWithEmojiSelection(
        null,
        'suggestion',
        {
          alertDescription: extraData?.alertDescription || '',
          sentiment: extraData?.sentiment || '😐',
          tips: extraData?.tips || '',
          isBlocked: extraData?.isBlocked || 'no',
          screenshot: null,
        }
      );
      break;

    default:
      console.warn(`[handleAction] Action non reconnue : ${action}`);
  }
}
 */