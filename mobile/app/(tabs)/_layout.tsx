import { useState } from "react";
import { Tabs } from "expo-router";
import { Bot, House, Plus, UserRound, WalletCards, WalletMinimal } from "lucide-react-native";
import { Button } from "tamagui";
import { TransactionEntryModal } from "@/features/finance/transaction-entry-modal";

export default function TabsLayout() {
  const [movementOpen, setMovementOpen] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#34d399",
          tabBarInactiveTintColor: "#9fb6d8",
          tabBarStyle: {
            backgroundColor: "#0f1726",
            borderTopColor: "#1d2b44",
            height: 78,
            paddingTop: 8,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="goals-projects"
          options={{
            title: "Espacios",
            tabBarIcon: ({ color, size }) => <WalletMinimal color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "Movimientos",
            tabBarIcon: ({ color, size }) => <WalletCards color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat IA",
            tabBarIcon: ({ color, size }) => <Bot color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
          }}
        />
      </Tabs>

      <Button
        position="absolute"
        right="$5"
        bottom="$8"
        width={78}
        height={78}
        circular
        zIndex={20}
        backgroundColor="#34d399"
        pressStyle={{ scale: 0.96, backgroundColor: "#34d399" }}
        onPress={() => setMovementOpen(true)}
      >
        <Plus color="#07111f" size={30} />
      </Button>

      <TransactionEntryModal visible={movementOpen} onClose={() => setMovementOpen(false)} />
    </>
  );
}
