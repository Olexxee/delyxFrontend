import { useCreateTournament } from "@/hooks/useTournaments";
import { useTheme } from "@/theme/ThemeProvider";
import type { ApiTournament } from "@/types/tournament";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    visible: boolean;
    groupId: string;
    onClose: () => void;
    onCreated: (tournament: ApiTournament) => void;
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface FormState {
    name: string;
    description: string;
    type: "league" | "knockout";
    rounds: "single" | "double";
    maxParticipants: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
}

const INITIAL: FormState = {
    name: "",
    description: "",
    type: "league",
    rounds: "double",
    maxParticipants: "16",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(input: string): string | null {
    const [dd, mm, yyyy] = input.split("/");
    const d = new Date(`${yyyy}-${mm}-${dd}`);
    return isNaN(d.getTime()) ? null : d.toISOString();
}

function validate(f: FormState): string | null {
    if (!f.name.trim()) return "Tournament name is required.";
    const deadline = parseDate(f.registrationDeadline);
    const start = parseDate(f.startDate);
    const end = parseDate(f.endDate);
    if (!deadline) return "Registration deadline invalid — use DD/MM/YYYY.";
    if (!start) return "Start date invalid — use DD/MM/YYYY.";
    if (!end) return "End date invalid — use DD/MM/YYYY.";
    if (new Date(deadline) <= new Date()) return "Registration deadline must be in the future.";
    if (new Date(start) <= new Date(deadline))
        return "Start date must be after registration deadline.";
    if (new Date(end) <= new Date(start)) return "End date must be after start date.";
    const max = parseInt(f.maxParticipants, 10);
    if (isNaN(max) || max < 2) return "Max participants must be at least 2.";
    return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
    label,
    labelColor,
    children,
}: {
    label: string;
    labelColor: string;
    children: React.ReactNode;
}) {
    return (
        <View style={s.field}>
            <Text style={[s.label, { color: labelColor }]}>{label}</Text>
            {children}
        </View>
    );
}

function Seg<T extends string>({
    options,
    value,
    onChange,
    accent,
    border,
    surface,
    muted,
}: {
    options: { label: string; value: T }[];
    value: T;
    onChange: (v: T) => void;
    accent: string;
    border: string;
    surface: string;
    muted: string;
}) {
    return (
        <View style={[s.seg, { borderColor: border, backgroundColor: surface }]}>
            {options.map((o) => {
                const on = o.value === value;
                return (
                    <TouchableOpacity
                        key={o.value}
                        style={[s.segItem, on && { backgroundColor: accent }]}
                        onPress={() => onChange(o.value)}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                s.segText,
                                { color: on ? "#fff" : muted },
                                on && { fontWeight: "700" },
                            ]}
                        >
                            {o.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CreateTournamentSheet({ visible, groupId, onClose, onCreated }: Props) {
    const { colors } = useTheme();
    const [form, setForm] = useState<FormState>(INITIAL);

    const { mutate: createTournament, isPending } = useCreateTournament(groupId);

    const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
        setForm((p) => ({ ...p, [k]: v }));

    const accent = (colors as any).accent ?? colors.primary;

    function submit() {
        const err = validate(form);
        if (err) return Alert.alert("Validation Error", err);

        createTournament(
            {
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                groupId,
                type: form.type,
                maxParticipants: parseInt(form.maxParticipants, 10),
                settings: {
                    pointsForWin: 3,
                    pointsForDraw: 1,
                    pointsForLoss: 0,
                    rounds: form.rounds,
                },
                startDate: parseDate(form.startDate)!,
                endDate: parseDate(form.endDate)!,
                registrationDeadline: parseDate(form.registrationDeadline)!,
            },
            {
                onSuccess: (data) => {
                    setForm(INITIAL);
                    onCreated(data.tournament as ApiTournament);
                    onClose();
                },
                onError: (e: any) => {
                    Alert.alert("Error", e?.message ?? "Failed to create tournament.");
                },
            }
        );
    }

    const inp = [
        s.input,
        {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.textPrimary,
        },
    ];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView
                style={[s.root, { backgroundColor: colors.background ?? colors.surface }]}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    {/* Header */}
                    <View style={[s.header, { borderBottomColor: colors.border }]}>
                        <Text style={[s.title, { color: colors.textPrimary }]}>
                            Create Tournament
                        </Text>
                        <TouchableOpacity onPress={onClose} hitSlop={12}>
                            <X size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={s.body}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Field label="Tournament Name *" labelColor={colors.textSecondary}>
                            <TextInput
                                style={inp}
                                placeholder="e.g. Spring Championship 2026"
                                placeholderTextColor={colors.textSecondary}
                                value={form.name}
                                onChangeText={(v) => set("name", v)}
                            />
                        </Field>

                        <Field label="Description (optional)" labelColor={colors.textSecondary}>
                            <TextInput
                                style={[inp, s.textarea]}
                                placeholder="Brief description..."
                                placeholderTextColor={colors.textSecondary}
                                value={form.description}
                                onChangeText={(v) => set("description", v)}
                                multiline
                                numberOfLines={3}
                            />
                        </Field>

                        <Field label="Tournament Type" labelColor={colors.textSecondary}>
                            <Seg
                                options={[
                                    { label: "League", value: "league" },
                                    { label: "Knockout", value: "knockout" },
                                ]}
                                value={form.type}
                                onChange={(v) => set("type", v)}
                                accent={accent}
                                border={colors.border}
                                surface={colors.surface}
                                muted={colors.textSecondary}
                            />
                        </Field>

                        {form.type === "league" && (
                            <Field label="Rounds" labelColor={colors.textSecondary}>
                                <Seg
                                    options={[
                                        { label: "Single Round-Robin", value: "single" },
                                        { label: "Double Round-Robin", value: "double" },
                                    ]}
                                    value={form.rounds}
                                    onChange={(v) => set("rounds", v)}
                                    accent={accent}
                                    border={colors.border}
                                    surface={colors.surface}
                                    muted={colors.textSecondary}
                                />
                            </Field>
                        )}

                        <Field label="Max Participants" labelColor={colors.textSecondary}>
                            <TextInput
                                style={inp}
                                placeholder="16"
                                placeholderTextColor={colors.textSecondary}
                                value={form.maxParticipants}
                                onChangeText={(v) => set("maxParticipants", v)}
                                keyboardType="number-pad"
                            />
                        </Field>

                        <Field
                            label="Registration Deadline * (DD/MM/YYYY)"
                            labelColor={colors.textSecondary}
                        >
                            <TextInput
                                style={inp}
                                placeholder="02/04/2026"
                                placeholderTextColor={colors.textSecondary}
                                value={form.registrationDeadline}
                                onChangeText={(v) => set("registrationDeadline", v)}
                                keyboardType="numbers-and-punctuation"
                            />
                        </Field>

                        <Field label="Start Date * (DD/MM/YYYY)" labelColor={colors.textSecondary}>
                            <TextInput
                                style={inp}
                                placeholder="03/04/2026"
                                placeholderTextColor={colors.textSecondary}
                                value={form.startDate}
                                onChangeText={(v) => set("startDate", v)}
                                keyboardType="numbers-and-punctuation"
                            />
                        </Field>

                        <Field label="End Date * (DD/MM/YYYY)" labelColor={colors.textSecondary}>
                            <TextInput
                                style={inp}
                                placeholder="08/05/2026"
                                placeholderTextColor={colors.textSecondary}
                                value={form.endDate}
                                onChangeText={(v) => set("endDate", v)}
                                keyboardType="numbers-and-punctuation"
                            />
                        </Field>

                        <TouchableOpacity
                            style={[s.btn, { backgroundColor: accent }, isPending && { opacity: 0.7 }]}
                            onPress={submit}
                            disabled={isPending}
                            activeOpacity={0.85}
                        >
                            {isPending ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={s.btnText}>Create Tournament</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

const s = StyleSheet.create({
    root: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: { fontSize: 17, fontWeight: "700" },
    body: { padding: 20, gap: 18, paddingBottom: 48 },
    field: { gap: 8 },
    label: { fontSize: 13, fontWeight: "600" },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
    },
    textarea: { height: 80, textAlignVertical: "top", paddingTop: 12 },
    seg: { flexDirection: "row", borderWidth: 1, borderRadius: 12, overflow: "hidden" },
    segItem: { flex: 1, paddingVertical: 11, alignItems: "center" },
    segText: { fontSize: 14 },
    btn: { borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 8 },
    btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});