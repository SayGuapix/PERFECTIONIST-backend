import { PropsWithChildren } from "react";
import { ScrollView, YStack } from "tamagui";

interface ScreenProps extends PropsWithChildren {
  padded?: boolean;
}

export function Screen({ children, padded = true }: ScreenProps) {
  return (
    <ScrollView flex={1} backgroundColor="#070b14">
      <YStack flex={1} gap="$5" padding={padded ? "$5" : "$0"} paddingBottom="$10">
        {children}
      </YStack>
    </ScrollView>
  );
}
