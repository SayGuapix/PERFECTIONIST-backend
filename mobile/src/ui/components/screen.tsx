import { PropsWithChildren } from "react";
import { ScrollView, YStack } from "tamagui";

interface ScreenProps extends PropsWithChildren {
  padded?: boolean;
}

export function Screen({ children, padded = true }: ScreenProps) {
  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack flex={1} gap="$4" padding={padded ? "$4" : "$0"}>
        {children}
      </YStack>
    </ScrollView>
  );
}
