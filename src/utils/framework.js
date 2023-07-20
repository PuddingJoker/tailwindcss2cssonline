import { tailwindToCss, originClasses } from "./index";

const importReg = /(import[^]*?\r?\n[\r\n]+)(?!import\b)/;

function updateCSSProperty(str) {
  const properties = str.split(';');

  for (let i = 0; i < properties.length; i++) {
    let property = properties[i].trim();
    const [key, value] = property.split(':').map(item => item.trim());

    if (key) {
      const updatedKey = key
        .split('-')
        .map((part, index) => (index > 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
        .join('');

      properties[i] = `${updatedKey}: ${value}`
    }
  }

  return properties.join('; ');
}

const JsxConvert = (content = "", way) => {
  let css = "";
  let count = 1;
  try {
    content = content.replace(/className="(.*?)"/g, (_, b) => {
      if (way === "native") {
        css += `.tailwindToCss${count}{
                    ${tailwindToCss(b)}
                }`;
        const classes = `className={\`$\{styles.tailwindToCss${count}\} ${Array.from(
          originClasses
        ).join(" ")}\`}`;
        count++;
        return classes;
      }

      if (way === "cssinjs") {
        css += `
                    const div${count} = css\`\n${tailwindToCss(b)} \`
                `;
        const classes = `className={\`$\{div${count}\} ${Array.from(
          originClasses
        ).join(" ")}\`}`;
        count++;
        return classes;
      }

      if (way === "inline") {
        let style = updateCSSProperty(tailwindToCss(b))

        style = `style={{${style}}}`
          .replace(/(\w+):\s*([^;]+)/g, '$1: "$2"')
          .replace(/;/g, ",");

        const classes = originClasses.size
          ? `className="${Array.from(originClasses).join(" ")}"`
          : "";
        return style + classes;
      }
    });

    if (way === "inline") {
      return content
    }
    if (way === "native") {
      const codeToInsert = `
                import styles from "./index.module.css";
            `;
      content = importReg.test(content) ? content.replace(importReg, `$1${codeToInsert}`) : codeToInsert + content;
      return {
        css, content
      }
    }

    if (way === "cssinjs") {
      const codeToInsert = `
                import { css } from "@linaria/core";
                ${css}
            `;
      content = importReg.test(content) ? content.replace(importReg, `$1${codeToInsert}`) : codeToInsert + content;
      return content
    }
  } catch (error) {
    return error
  }
};

const VueConvert = (content = "", way) => {
  let css = "";
  let count = 1;
  try {
    content = content.replace(/class="(.*?)"/g, (_, b) => {
      if (way === "native") {
        const hasBackTick = b.includes("`");
        if (hasBackTick) {
          console.warn(`——————————————————————————————————————————compile fail while class got backtick:\n${b}\n
                                    ——————————————————————————————————————————`);
          return _;
        }
        css += `.tailwindToCss${count}{
                    ${tailwindToCss(b)}
                }`;
        const classes = `class="tailwindToCss${count} ${Array.from(
          originClasses
        ).join(" ")}"`;
        count++;
        return classes;
      }

      if (way === "cssinjs") {
        css += `
                    const div${count} = css\`\n${tailwindToCss(b)} \`
                `;
        const classes = `:class="div${count}"`;
        count++;
        return classes;
      }

      if (way === "inline") {
        const hasBackTick = b.includes("`");
        if (hasBackTick) {
          console.warn(`——————————————————————————————————————————compile fail while class got backtick:\n${b}\n
                                    ——————————————————————————————————————————`);
          return _;
        }

        const styles = `style="${tailwindToCss(b)}"`

        const classes = originClasses.size
          ? `class="${Array.from(originClasses).join(" ")}"`
          : "";
        return styles + classes;
      }
    });

    if (way === "inline") {
      return content
    }
    if (way === "native") {
      const styleReg = /<style\s*scoped>([\s\S]*?)<\/style>/;
      const matches = content.match(styleReg);

      let codeToInsert;

      if (matches) {
        const originStyle = matches[1];
        codeToInsert = `
            <style scoped>
            ${originStyle}
                ${css}
            </style>
            `;
        content = content.replace(styleReg, codeToInsert);
      } else {
        codeToInsert = `
            <style scoped>
                ${css}
            </style>
            `;
        content = content + codeToInsert;
      }
      return {
        content,
        css: null
      }
    }

    if (way === "cssinjs") {
      return "vue framework cssinjs is not available now ~~~~~~~~~~~~~~~";
    }
  } catch (error) {
    return error
  }
};

/**
 *
 * @param {*} content   content
 * @param {*} VueOrJsx  project framework:  "vue"  "react"
 * @param {*} way  compile way: "inline"  "native"  "cssinjs"
 */

const run = (content, VueOrJsx = "react", way = "inline") => {
  try {
    if (VueOrJsx === "react") return JsxConvert(content, way);
    if (VueOrJsx === "vue") return VueConvert(content, way);
  } catch (error) {
    console.log(error);
  }
};

export default run