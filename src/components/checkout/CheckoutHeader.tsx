import CustomText from "@components/global/CustomText";
import Icon from "@components/global/Icon";
import { Colors } from "@unistyles/Constants";
import { goBack } from "@utils/NavigationUtils";
import { Pressable, SafeAreaView, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";



const CheckoutHeader: FC<{
  title: string;
}> = ({title}) => {
  return (
    <SafeAreaView>
      <View style={Styles.flexRow}>
        <View style={Styles.flexRowGap}>
          <Pressable onPress={() => goBack()}>
            <Icon name="chevron-back" iconFamily="Ionicons" size={16}/>
          </Pressable>
          <View>
            <CustomText
              fontFamily="Okra-Bold"
              fontSize={11}
              style={Styles.text}>
                {title}
              </CustomText>
              <CustomText
                fontFamily="Okra-Medium"
                fontSize={10}
                style={Styles.text2}>
                  Delivering to Pratap Nagar, Jaipur
                </CustomText>
          </View>
        </View>
        <View style={{Width:20}}>
          <Icon
            iconFamily="Ionicons"
            name="share-outline"
            color={Colors.primary}
            size={RFValue(16)}
            />
        </View>
      </View>
    </SafeAreaView>
  );
};
