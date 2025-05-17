import { View, Platform, FlatList } from 'react-native';
import React, { FC } from 'react';
import { useRoute } from '@react-navigation/native';
import { restaurantHeaderStyles } from '@unistyles/restuarantStyles';
import { useStyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import SortingAndFilters from '@components/home/SortingAndFilters';
import { restaurantItemsData, restaurantsItemfiltersOption } from '@utils/dummyData';
import RestaurantHeader from '@components/restaurant/RestaurantHeader';
import DottedLine from '@components/ui/DottedLine';
import FoodCard from '@components/restaurant/FoodCard';

const RestaurantScreen: FC = () => {

  const route = useRoute() as any;
  const restaurant = route?.params?.item;
  const {styles} = useStyles(restaurantHeaderStyles);
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: any) => {
    return(
      <FoodCard item={item} restaurant={restaurant}/>
    );
  };
  return (
    <>
    <View style={{height: Platform.OS === 'android' ? insets.top : 0}}/>
    <CustomSafeAreaView>

      <RestaurantHeader title={restaurant?.name}/>


      <View style={styles.sortingContainer}>
        <SortingAndFilters
           menuTitle="Filter"
           options={restaurantsItemfiltersOption}
           />
      </View>

      <FlatList
         data={restaurantItemsData}
         renderItem={renderItem}
         scrollEventThrottle={16}
         keyExtractor={item => item.id}
         ItemSeparatorComponent={() => (
          <View style={styles.mainPadding}>
            <DottedLine/>
          </View>
         )}
         contentContainerStyle={styles.scrollContainer}
         />
    </CustomSafeAreaView>
    </>
  );
};

export default RestaurantScreen;
