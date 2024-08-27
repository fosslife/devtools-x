/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-deprecated */
import React, { MouseEvent } from "react";
import { ColorResult, CustomPicker, HSLColor } from "react-color";
import { Hue, Saturation } from "react-color/lib/components/common";
import { Convert } from "@/utils/colors";
import tinycolor2 from "tinycolor2";

const inlineStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "auto",
    width: "100%",
    textAlign: "center",
    justifyContent: "center",
    // margin: "auto"
  },
  pointer: {
    transform: "translate(-50%, -50%)",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.37)",
    border: "1px solid #fff",
    cursor: "pointer",
  },
  slider: {
    width: "8px",
    borderRadius: "1px",
    height: "20px",
    boxShadow: "0 0 2px rgba(0, 0, 0, .6)",
    background: "#fff",
    transform: "translateX(-2px)",
  },
  saturation: {
    width: "100%",
    paddingBottom: "15%",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
  },
  swatchCircle: {
    minWidth: 20,
    minHeight: 20,
    margin: "1px 2px",
    cursor: "pointer",
    background: "red",
    zIndex: 9,
    boxShadow: "0 0 2px rgba(0, 0, 0, .6)",
    borderRadius: "50%",
  },
};

const onPointerMouseDown = (event: MouseEvent<HTMLDivElement>) => {
  const pointer = document.querySelector(".custom-pointer") as HTMLDivElement;
  const pointerContainer = pointer?.parentElement as HTMLDivElement;
  if (pointerContainer) {
    pointerContainer.style.top = event.clientY + "px";
    pointerContainer.style.left = event.clientX + "px";
  }
};

const CustomSlider = () => {
  return <div style={inlineStyles.slider} />;
};

interface Props {
  colors?: string[];
  hexCode: string;
  onChange: (color: ColorResult) => void;
}
interface State {
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  hex: string;
}

// Todo Convert to functional component
// The docs of react-color aren't that good, but the picker is more customizable than the previous one
class CustomColorPicker extends React.Component<Props, State> {
  convert = new Convert();

  constructor(props: Props) {
    super(props);
    this.state = {
      hsl: {
        h: 0,
        s: 0,
        l: 0,
      },
      hsv: {
        h: 0,
        s: 0,
        v: 0,
      },
      hex: "aaaaaa",
    };
  }

  CustomPointer = () => (
    <div
      className="custom-pointer"
      style={{ ...inlineStyles.pointer, background: this.state.hex }}
    />
  );

  guard = (num: number) => {
    if (isNaN(num)) return 0;
    return num > 255 ? 255 : num < 0 ? 0 : num;
  };

  componentDidMount() {
    const color = tinycolor2(this.props.hexCode);
    this.setState({
      hsv: color.toHsv(),
      hsl: color.toHsl(),
      hex: color.toHex(),
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.hexCode !== this.state.hex) {
      const color = tinycolor2(nextProps.hexCode);
      this.setState({
        hsv: color.toHsv(),
        hsl: color.toHsl(),
        hex: color.toHex(),
      });
    }
  }

  handleHueChange = (hue: HSLColor) => {
    const color = tinycolor2(hue);
    const newState = {
      hsl: hue,
      hsv: color.toHsv(),
      hex: color.toHex(),
      rgb: color.toRgb(),
    };
    this.setState(newState);
    this.props.onChange(newState);
  };

  handleSaturationChange = (hsv: ColorResult) => {
    const color = tinycolor2(hsv as any);

    this.props.onChange(hsv);
    const input = document.body.getElementsByTagName("input");
    if (input[5]) {
      input[5].value = color.toHex();
    }
    this.setState({
      hsl: color.toHsl(),
    });
  };

  render() {
    return (
      <div style={inlineStyles.container as any}>
        <div
          style={inlineStyles.saturation as any}
          onMouseDown={onPointerMouseDown}
        >
          <Saturation
            // @ts-ignore
            hsl={this.state.hsl}
            hsv={this.state.hsv}
            pointer={this.CustomPointer}
            onChange={this.handleSaturationChange}
          />
        </div>
        <div
          style={{
            height: 20,
            position: "relative",
            width: "100%",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            overflow: "hidden",
          }}
        >
          <Hue
            hsl={this.state.hsl}
            pointer={CustomSlider}
            // @ts-ignore
            onChange={this.handleHueChange}
            direction={"horizontal"}
          />
        </div>
      </div>
    );
  }
}

// @ts-ignore
export default CustomPicker(CustomColorPicker);
