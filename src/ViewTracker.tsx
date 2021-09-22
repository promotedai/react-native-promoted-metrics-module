import { NavigationContext } from '@react-navigation/core'
import * as React from 'react'
import { NativeModules } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import type { PromotedMetricsType } from './PromotedMetricsType'

const { PromotedMetrics } = NativeModules
const P = PromotedMetrics as PromotedMetricsType

export type AutoViewState = {

  /** navigation.state.routeName */
  routeName: string

  /** navigation.state.key */
  routeKey: string

  /** UUID of view, for use as primary key in event. */
  autoViewId: string
}

/**
 * Most recently logged view state.
 * Prevents us from logging same view twice in a row.
 */
export var currentAutoViewState: AutoViewState = {
  routeName: '',
  routeKey: '',
  autoViewId: '',
}

export function overrideAutoViewState(
  routeName: string,
  routeKey: string,
  viewId: string,
) {
  currentAutoViewState = {
    routeName: routeName,
    routeKey: routeKey,
    autoViewId: viewId,
  }
}

/**
 * Creates an `AutoViewState` with a hook that will automatically
 * log a Promoted view when it receives navigation focus.
 * There must be a `NavigationContext` available for this to succeed.
 *
 * In order to properly enable automatic view logging, some path
 * needs to go through this method to install the hook. As of this
 * writing, there are 3 ways to do this:
 *
 * 1. Use one of `useCollectionTracker()` or `withCollectionTracker()`.
 *    The wrapped Component will automatically log a view when it gains
 *    navigation focus.
 * 2. Use the `useMetricsLogger()` hook. This installs another hook that
 *    will automatically log a view when the current functional component
 *    gains focus.
 * 3. Use `withMetricsLogger()` with some component. This component will
 *    then automatically log a view when it gains focus.
 *
 * You can mix and match these approaches in your Components. For example,
 * you can place CollectionTracker inside a Component wrapped with
 * `withMetricsLogger()` and automatic view logging will still work properly.
 *
 * If you can't do any of these at the point of logging, please talk to the
 * mobile team at Promoted. Some things we might suggest:
 *
 * 1. If there's a parent component, then install one of the hooks there
 *    to make it automatically log a view. This is less desirable because
 *    it separates the view and action logging, but it works.
 * 2. Log the view manually. You can call `MetricsLogger.logView` to cause
 *    a view to be unconditionally logged. This may not produce the most
 *    accurate tracking, so use with caution.
 * 3. Install handlers on a `NavigationContainer` to log when the route
 *    changes. This is also less desirable because it will log *every*
 *    view change that occurs within, not just relevant ones.
 *
 * @returns Updating `AutoViewState` if available, `null` otherwise
 */
export function useAutoViewState() {
  const navigation = React.useContext(NavigationContext)
  const [autoViewState, setAutoViewState] = navigation !== undefined
    ? React.useState({
        routeName: navigation.state.routeName,
        routeKey: navigation.state.key,
        autoViewId: ''
      } as AutoViewState)
    : [null, null]

  React.useEffect(() => {
    if (
      navigation === undefined ||
      autoViewState == null ||
      setAutoViewState == null
    ) {
      return () => {}
    }
    const removeListener = navigation.addListener('focus', () => {
      if (currentAutoViewState.routeKey != autoViewState.routeKey) {
        // Generates a new primary key for this.
        const updatedAutoViewState = {
          ...autoViewState,
          autoViewId: uuidv4(),
        }
        // Sets state for this context.
        setAutoViewState(updatedAutoViewState)
        // Logs this view as being topmost.
        P.logAutoView(updatedAutoViewState)
        // Sets state globally for most recent logged view.
        currentAutoViewState = updatedAutoViewState
      }
    })
    return () => { removeListener() }
  }, [navigation, autoViewState, setAutoViewState])

  return autoViewState
}

/**
 * Wraps a Component with `AutoViewState` so that it will automatically
 * log a Promoted view when it receives navigation focus.
 */
export function withAutoViewState<P>(
  Component: React.ComponentType<P>
) {
  const AutoViewStateComponent = ({
    ...rest
  }) : React.ReactElement => {
    const autoViewState = useAutoViewState()
    return (
      <Component
        autoViewState={autoViewState}
        {...rest}
      />
    )
  }
  return AutoViewStateComponent
}
