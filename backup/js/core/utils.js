export function formatNumber(num) {
    const absNum = Math.abs(num);

    const units = [
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "B" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "Qa" },
        { value: 1e18, symbol: "Qi" },
        { value: 1e21, symbol: "Sx" },
        { value: 1e24, symbol: "Sp" },
        { value: 1e27, symbol: "Oc" },
        { value: 1e30, symbol: "No" },
        { value: 1e33, symbol: "Dc" },
        { value: 1e36, symbol: "Ud" },
        { value: 1e39, symbol: "Dd" },
        { value: 1e42, symbol: "Td" },
        { value: 1e45, symbol: "Qd" }
    ];

    for (let i = units.length - 1; i >= 0; i--) {
        if (absNum >= units[i].value) {
            return (num / units[i].value).toFixed(2) + units[i].symbol;
        }
    }

    return num.toString();
}
