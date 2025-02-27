import templateOnly from "@ember/component/template-only";

export interface ButtonContentSignature {
    Args: {
        loading?: boolean;
        "material-icon"?: string;
    };
    Blocks: {
        default: [];
    };
}

export default templateOnly<ButtonContentSignature>();
