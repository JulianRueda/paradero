import { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path, Rect, Text as SvgText } from "react-native-svg";

import { useT } from "@/i18n";
import { systems, usePalette } from "@/theme/colors";
import { fonts, layout, radius, space } from "@/theme/tokens";

import { Text } from "./text";
import type { MapHandle, TransitMapProps } from "./transit-map.types";

/**
 * There is no live map on the web. In its place, the Trazo diagram of the trunk lines: an illustration, never
 * a position, so it carries no buses and says so in plain words. Colours come from the parts of the system.
 */
const LINES: { d: string; color: string }[] = [
  { d: "M232 -10V250L196 286V580", color: systems.zonal_urbano.dot },
  { d: "M232 120L312 40V-10", color: systems.alimentador.dot },
  { d: "M-10 110H96L156 170H232", color: systems.zonal_complementario.dot },
  { d: "M-10 236H232", color: systems.zonal_especial.dot },
  { d: "M196 330H300L344 286H400", color: systems.transmicable.dot },
  { d: "M-10 470H96L136 430H196", color: systems.troncal.dot },
  { d: "M196 380L280 464V580", color: systems.dual.dot },
];

/** Portals are squares, stations are rings, transfers are capsules, as on the map in the native app's sheet. */
const PORTALS: [number, number, string][] = [
  [40, 110, "Portal Suba"],
  [60, 236, "Portal 80"],
  [312, 24, "Portal Norte"],
  [196, 546, "Portal Sur"],
  [40, 470, "Portal Américas"],
];
const STATIONS: [number, number, string?][] = [[96, 110], [150, 236, "Boyacá"], [272, 80], [232, 50], [196, 500], [292, 330], [344, 286, "Universidades"], [240, 424], [280, 520]];
const TRANSFERS: [number, number, string?][] = [[232, 120, "Calle 100"], [232, 170, "Calle 76"], [232, 236, "Calle 72"], [196, 330, "Av. Jiménez"], [196, 380], [196, 430]];

export const TransitMap = forwardRef<MapHandle, TransitMapProps>(function TransitMap(_props, _ref) {
  const p = usePalette();
  const t = useT();
  const label = (x: number, y: number, name?: string) =>
    name ? (
      <SvgText key={`l${name}`} x={Math.min(x + 12, 300)} y={y - 12} fontFamily={fonts[500]} fontSize={11} fill={p.muted}>
        {name}
      </SvgText>
    ) : null;

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: p.background }]}>
      <Svg width="100%" height="100%" viewBox="0 0 390 570" preserveAspectRatio="xMidYMid slice" accessible={false} importantForAccessibility="no-hide-descendants">
        <Path d="M-10 300C60 280 110 350 160 330S280 250 400 300" stroke={p.fillStrong} strokeWidth={18} fill="none" strokeLinecap="round" />
        {LINES.map((l) => (
          <Path key={l.d} d={l.d} stroke={l.color} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {STATIONS.map(([x, y, name]) => [
          <Circle key={`s${x}-${y}`} cx={x} cy={y} r={8.5} fill={p.elevated} stroke={p.ink} strokeWidth={3} />,
          label(x, y, name),
        ])}
        {PORTALS.map(([x, y, name]) => [
          <Rect key={`p${x}-${y}`} x={x - 9} y={y - 9} width={18} height={18} fill={p.elevated} stroke={p.ink} strokeWidth={3} />,
          label(x, y, name),
        ])}
        {TRANSFERS.map(([x, y, name]) => [
          <Rect key={`t${x}-${y}`} x={x - 16} y={y - 8} width={32} height={16} rx={8} fill={p.elevated} stroke={p.ink} strokeWidth={3} />,
          name ? (
            <SvgText key={`l${name}`} x={x + 22} y={y + 4} fontFamily={fonts[500]} fontSize={11} fill={p.muted}>
              {name}
            </SvgText>
          ) : null,
        ])}
      </Svg>
      <View style={[styles.note, { backgroundColor: p.elevated, borderColor: p.border }]}>
        <Text variant="caption" tone="muted">
          {t.map.webOnly}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  note: { position: "absolute", top: layout.mapInset.top, left: space[4], right: space[4], alignSelf: "center", paddingHorizontal: space[3], paddingVertical: space[2], borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
});
