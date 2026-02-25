import { COLORS } from "@/src/theme/colors";
import { Pressable, View } from "react-native";

function TabBarButton({ children, accessibilityState, style, ...props }: any) {
  const focused = accessibilityState?.selected;

  return (
    <Pressable
      {...props}
      style={[
        style,
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      {/* Faixa superior */}
      {focused && (
        <View
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: 3,
            backgroundColor: COLORS.primary,
          }}
        />
      )}

      {children}
    </Pressable>
  );
}