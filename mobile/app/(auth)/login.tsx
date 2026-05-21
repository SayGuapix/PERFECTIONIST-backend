import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, LockKeyhole, Mail, TrendingUp } from "lucide-react-native";
import { Button, Card, Input, Paragraph, Text, XStack, YStack } from "tamagui";
import { Screen } from "@/ui/components/screen";
import { useLogin } from "@/features/auth/hooks";

const schema = z.object({
  email: z.email("Correo invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

const colors = {
  bg: "#070b14",
  panel: "#0f1726",
  border: "#1d2b44",
  text: "#f8fafc",
  muted: "#9fb6d8",
  green: "#34d399",
  red: "#ef4444",
};

export default function LoginScreen() {
  const mutation = useLogin();
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      router.replace("/(tabs)/dashboard");
    } catch {
      // React Query exposes the message through mutation.error.
    }
  });

  return (
    <Screen>
      <YStack width="100%" maxWidth={440} alignSelf="center" minHeight={620} justifyContent="center" gap="$5" paddingVertical="$6">
        <YStack alignItems="center" gap="$3">
          <YStack width={58} height={58} borderRadius={18} alignItems="center" justifyContent="center" backgroundColor="#073328" borderWidth={1} borderColor="#145c48">
            <TrendingUp color={colors.green} size={30} strokeWidth={2.6} />
          </YStack>
          <Text color={colors.text} fontSize="$8" fontWeight="900" textAlign="center">
            Perfectionist
          </Text>
        </YStack>

        <Card width="100%" backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$6" padding="$5">
          <YStack gap="$5">
            <YStack gap="$2">
              <Text color={colors.text} fontSize="$8" fontWeight="900">
                Iniciar sesion
              </Text>
              <Paragraph color={colors.muted}>
                Ingresa tus datos para continuar.
              </Paragraph>
            </YStack>

            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <YStack gap="$2">
                  <XStack alignItems="center" gap="$3" minHeight={58} borderWidth={1} borderColor={fieldState.error ? colors.red : colors.border} borderRadius="$5" backgroundColor={colors.bg} paddingHorizontal="$4">
                    <Mail color={fieldState.error ? colors.red : colors.muted} size={21} />
                    <Input
                      flex={1}
                      unstyled
                      backgroundColor="transparent"
                      borderWidth={0}
                      color="$color"
                      placeholder="Correo"
                      placeholderTextColor="$secondary"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                  </XStack>
                  {fieldState.error ? <Paragraph color={colors.red}>{fieldState.error.message}</Paragraph> : null}
                </YStack>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <YStack gap="$2">
                  <XStack alignItems="center" gap="$3" minHeight={58} borderWidth={1} borderColor={fieldState.error ? colors.red : colors.border} borderRadius="$5" backgroundColor={colors.bg} paddingHorizontal="$4">
                    <LockKeyhole color={fieldState.error ? colors.red : colors.muted} size={21} />
                    <Input
                      flex={1}
                      unstyled
                      backgroundColor="transparent"
                      borderWidth={0}
                      color="$color"
                      placeholder="Contrasena"
                      placeholderTextColor="$secondary"
                      secureTextEntry
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                  </XStack>
                  {fieldState.error ? <Paragraph color={colors.red}>{fieldState.error.message}</Paragraph> : null}
                </YStack>
              )}
            />

            <Button height={58} backgroundColor={colors.green} borderRadius="$5" onPress={onSubmit} disabled={mutation.isPending} pressStyle={{ scale: 0.98, backgroundColor: colors.green }}>
              <XStack alignItems="center" gap="$2">
                <Text color="#07111f" fontWeight="900" fontSize="$5">
                  {mutation.isPending ? "Entrando..." : "Entrar"}
                </Text>
                {!mutation.isPending ? <ArrowRight color="#07111f" size={20} /> : null}
              </XStack>
            </Button>

            {mutation.error ? (
              <Card backgroundColor="#2a1116" borderColor="#7f1d1d" borderWidth={1} borderRadius="$4" padding="$3">
                <Paragraph color="#fecaca">{mutation.error.message}</Paragraph>
              </Card>
            ) : null}

            <XStack justifyContent="center" alignItems="center" gap="$1" flexWrap="wrap">
              <Paragraph color={colors.muted}>No tienes cuenta?</Paragraph>
              <Link href="/(auth)/register" asChild>
                <Button chromeless paddingHorizontal="$2">
                  <Text color={colors.green} fontWeight="900">
                    Crear cuenta
                  </Text>
                </Button>
              </Link>
            </XStack>
          </YStack>
        </Card>
      </YStack>
    </Screen>
  );
}
