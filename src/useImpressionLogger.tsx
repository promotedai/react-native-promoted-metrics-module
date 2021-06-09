import { useCallback, useEffect } from 'react';
import { NativeModules } from 'react-native';
import type { ViewToken } from 'react-native';

const { PromotedMetrics } = NativeModules;

export const promotedViewabilityConfig = {
  waitForInteraction: false,
  minimumViewTime: 1000,
  itemVisiblePercentThreshold: 50
}

/**
 * Returns handlers for use with onViewableItemsChanged and
 * viewabilityConfig for FlatLists and SectionLists.
 */
export const useImpressionLogger = (
    collectionViewName: string,
    contentCreator: (viewToken: ViewToken) => Object) => {

  const _viewabilityConfig = promotedViewabilityConfig

  const _onViewableItemsChanged = useCallback(
    ({viewableItems}) => {
      const contentList = viewableItems.map(contentCreator);
      PromotedMetrics.collectionViewDidChange(contentList, collectionViewName);
    }, []);

  useEffect(() => {
    PromotedMetrics.collectionViewDidMount(collectionViewName);
    return () => {
      PromotedMetrics.collectionViewWillUnmount(collectionViewName);
    }
  }, []);

  return { _viewabilityConfig, _onViewableItemsChanged }
};
