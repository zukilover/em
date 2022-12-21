import React from 'react'
import { useSelector } from 'react-redux'
import GesturePath from '../@types/GesturePath'
import State from '../@types/State'
import { isTouch } from '../browser'
import { TUTORIAL_STEP_FIRSTTHOUGHT } from '../constants'
import { useOfflineStatus } from '../data-providers/yjs'
import getSetting from '../selectors/getSetting'
import themeColors from '../selectors/themeColors'
import { shortcutById } from '../shortcuts'
import GestureDiagram from './GestureDiagram'
import LoadingEllipsis from './LoadingEllipsis'

interface NewThoughtInstructionsProps {
  childrenLength: number
  isTutorial: boolean
}

// assert the search shortcut at load time
const newThoughtShortcut = shortcutById('newThought')
if (!newThoughtShortcut) {
  throw new Error('newThought shortcut not found.')
}

/** An absolutely centered LoadingEllipsis. */
const CenteredLoadingEllipsis = () => (
  <div className='absolute-center'>
    <i className='text-note'>
      <LoadingEllipsis />
    </i>
  </div>
)

/** Display platform-specific instructions of how to create a thought when a context has no thoughts. */
const NewThoughtInstructions = ({ childrenLength, isTutorial }: NewThoughtInstructionsProps) => {
  /*
    Determining when to show the loader is nontrivial due to many loading states of local and remote, Firebase connection and authentication status, and pending thoughts.

    state.status and state.isLoading are very fragile. They are coupled to pull, updateThoughts, and NewThoughtInstructions.

    Related:
    - https://github.com/cybersemics/em/issues/1344
    - https://github.com/cybersemics/em/pull/1345
  */
  const statusWebsocket = useOfflineStatus()

  const tutorialStep = useSelector((state: State) => +(getSetting(state, 'Tutorial Step') || 0))

  const colors = useSelector(themeColors)

  return (
    <div className='new-thought-instructions'>
      {
        // show nothing during the preload phase (See: useOfflineStatus)
        childrenLength === 0 && statusWebsocket === 'preload' ? null : childrenLength === 0 &&
          statusWebsocket === 'loading' ? (
          // show loading ellipsis when loading
          <CenteredLoadingEllipsis />
        ) : // tutorial no children
        // show special message when there are no children in tutorial
        isTutorial ? (
          childrenLength === 0 && (tutorialStep !== TUTORIAL_STEP_FIRSTTHOUGHT || !isTouch) ? (
            <div className='center-in-content'>
              <i className='text-note'>Ahhh. Open space. Unlimited possibilities.</i>
            </div>
          ) : // hide on mobile during TUTORIAL_STEP_FIRSTTHOUGHT since the gesture diagram is displayed
          null
        ) : (
          // default
          <>
            <span style={{ userSelect: 'none' }}>
              {isTouch ? (
                <span className='gesture-container'>
                  Swipe{' '}
                  <GestureDiagram path={newThoughtShortcut.gesture as GesturePath} size={30} color={colors.gray66} />
                </span>
              ) : (
                <span>Hit the Enter key</span>
              )}{' '}
              to add a new thought.
            </span>
          </>
        )
      }
    </div>
  )
}

const NewThoughtInstructionsMemo = React.memo(NewThoughtInstructions)
NewThoughtInstructionsMemo.displayName = 'NewThoughtInstructions'

export default NewThoughtInstructionsMemo
