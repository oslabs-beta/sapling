const R = 0;
const G = 1;
const B = 2;

class ColorUtil {
    constructor(colorcodes) {
        this.colors = [];
        this.setGradientColors(colorcodes);
    }

    setGradientColors(colorcodes) {
        colorcodes.forEach((colorcode) => {
            const rgbCode = this.parseRGB(colorcode);

            this.colors.push(rgbCode);
        });
    }

    parseRGB(colorcode) {
        let m = colorcode.match(/^#([0-9a-f]{6})$/i)[1];

        if (m) {
            return [
                parseInt(m.substr(0, 2), 16),
                parseInt(m.substr(2, 2), 16),
                parseInt(m.substr(4, 2), 16)
            ];
        }

        m = colorcode.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (m) {
            return [m[1], m[2], m[3]];
        }

        return false;
    }

    colorToString(color) {
        return `rgb(${color[R]}, ${color[G]}, ${color[B]})`;
    }

    getColorCodeByPercent(percent) {
        const numberOfColors = this.colors.length;

        const percentPerPart  = 100 / (numberOfColors - 1);
        const startColorIndex = parseInt(percent / percentPerPart, 10);
        const percentFromPart = (percent % percentPerPart) / percentPerPart;
        const startColor      = this.colors[startColorIndex];
        const endColor        = startColorIndex === numberOfColors - 1
                                    ? this.colors[startColorIndex]
                                    : this.colors[startColorIndex + 1];

        const deltaColor = [
            (startColor[R] - endColor[R]),
            (startColor[G] - endColor[G]),
            (startColor[B] - endColor[B])
        ];

        const resultColor = [
            startColor[R] + Math.round((deltaColor[R] * percentFromPart)),
            startColor[G] + Math.round((deltaColor[G] * percentFromPart)),
            startColor[B] + Math.round((deltaColor[B] * percentFromPart))
        ];

        return this.colorToString(resultColor);
    }
}

export default ColorUtil;
