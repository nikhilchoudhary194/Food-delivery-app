import { NativeScrollEvent, NativeSyntheticEvent, SectionList, ViewToken } from 'react-native';
import React, { FC, useRef, useState } from 'react';
import ExploreList from '@components/list/ExploreList';
import RestaurantList from './RestaurantList';
import { useStyles } from 'react-native-unistyles';
import { useSharedState } from '@features/tabs/SharedContext';
import { restaurantStyles } from '@unistyles/restuarantStyles';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import BackToTopButton from '@components/ui/BackToTopButton';
import { filtersOption } from '@utils/dummyData';
import SortingAndFilters from '@components/home/SortingAndFilters';

const sectionedData = [
  {title: 'Explore', data: [{}], renderItem: () => <ExploreList/>},
  {title: 'Restaurants', data: [{}], renderItem: () => <RestaurantList/>},

];

const MainList: FC = () => {
  const { styles } = useStyles(restaurantStyles);
  const { scrolly, scrollToTop, scrollyGlobal } = useSharedState();
  const previousScrollyTopButton = useRef<number>(0);
  const prevScrolly = useRef(0);
  const sectionListRef = useRef<SectionList>(null);

  const [isRestauratVisible, setIsRestaurantsVisible] = useState(false);
  const [isNearEnd, setIsNearEnd] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) =>{
    const currentScrolly = event?.nativeEvent?.contentOffset?.y;
    const isScrollingDown = currentScrolly > prevScrolly?.current;

    scrolly.value = isScrollingDown
    ? withTiming(1, {duration: 300})
    : withTiming(0, {duration: 300});

    scrollyGlobal.value = currentScrolly;
    prevScrolly.current = currentScrolly;

    const containerHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event?.nativeEvent?.layoutMeasurement?.height;
    const offset = event?.nativeEvent?.contentOffset?.y;

    setIsNearEnd(offset + layoutHeight >= containerHeight - 500);

  };

  const handleScrollToTop = async () => {
    scrollToTop();
    sectionListRef.current?.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      animated: true,
      viewPosition: 0,
    });
  };

  const backToTopStyle = useAnimatedStyle(() => {
    const isScrollingUp =
    scrollyGlobal?.value < previousScrollyTopButton.current &&
    scrollyGlobal.value > 180;
    const opacity = withTiming(
      isScrollingUp && (isRestauratVisible || isNearEnd) ? 1 : 0,
      {duration: 300},
    );
    const translateY = withTiming(
      isScrollingUp && (isRestauratVisible || isNearEnd) ? 0 : 10,
      {duration: 300},
    );

    previousScrollyTopButton.current = scrollyGlobal.value;

    return {
      opacity,
      transform: [{translateY}],
    };
  });

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 80,
  };

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>;
  }) => {
    const restaurantVisible = viewableItems.some(
      item => item?.section?.title === 'Restaurants' && item?.isViewable,
    );
    setIsRestaurantsVisible(restaurantVisible);
  };

  return (
    <>
    <Animated.View style={[styles.backToTopButton, backToTopStyle]}>
      <BackToTopButton onPress={handleScrollToTop}/>
    </Animated.View>
    <SectionList
    overScrollMode="always"
    onScroll={handleScroll}
    ref={sectionListRef}
    scrollEventThrottle={16}
    sections={sectionedData}
    bounces={false}
    nestedScrollEnabled
    showsVerticalScrollIndicator={false}
    keyExtractor={(item, index) => index.toString()}
    contentContainerStyle={styles.listContainer}
    stickySectionHeadersEnabled={true}
    viewabilityConfig={viewabilityConfig}
    onViewableItemsChanged={onViewableItemsChanged}
    renderSectionHeader={({section})=>{
      if (section.title !== 'Restaurants') {
        return null;
      }
      return (
        <Animated.View
         style={[
          isRestauratVisible || isNearEnd ? styles.shadowBottom : null,

        ]}>
          <SortingAndFilters menuTitle="Sort" options={filtersOption}/>
        </Animated.View>
      );
      }
    }
    />

    </>
  );
};

export default MainList;
