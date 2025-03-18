/**
 * Copyright 2025 ritazheng1011
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `rpg-character`
 *
 * @demo index.html
 * @element rpg-character
 */
export class RpgCharacter extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "rpg-character";
  }

  constructor() {
    super();
    this.organization = "";
    this.repo = "";
    this.limit = 6;
    this.contributors = [];
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      organization: { type: String },
      repo: { type: String },
      limit: { type: Number },
      contributors: { type: Array },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
          padding: 10px;
        }
        .contributor {
          margin-bottom: 15px;
        }
        .contributors-list {
          text-align: center;
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        input {
          font-size: var(
            --rpg-character-label-font-size,
            var(--ddd-font-size-s)
          );
          margin-bottom: 20px;
          padding: 10px;
          font-size: 16px;
          width: 100%;
          max-width: 300px;
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html` <h2>
        GitHub Contributors for ${this.organization} / ${this.repo}
      </h2>
      <details open>
        <summary>Search Inputs</summary>
        <div>
          <input
            id="organization"
            placeholder="Enter organization name"
            @input="${this.organizationChange}"
          />
        </div>
        <div>
          <input
            id="repo"
            placeholder="Enter repository"
            @input="${this.repoChange}"
          />
        </div>
      </details>
      <div class="contributors-list">
        ${this.contributors.map(
          (contributor, index) => html`
            //i googled this
            <div class="contributor">
              <a href="https://github.com/${contributor.login}" target="_blank">
                <rpg-character
                  seed="${contributor.login}"
                  hat="construction"
                ></rpg-character>
              </a>
              <div>${contributor.login}</div>
              <div>Contributions: ${contributor.contributions}</div>
            </div>
          `
        )}
      </div>`;
  }

  organizationChange(e) {
    this.organization = e.target.value;
    this.updateResults();
  }

  repoChange(e) {
    this.repo = e.target.value;
    this.updateResults();
  }

  updated(changedProperties) {
    if (
      changedProperties.has("organization") ||
      changedProperties.has("repo")
    ) {
      this.updateResults();
    }
  }

  async updateResults() {
    if (this.organization && this.repo) {
      const response = await fetch(
        `https://api.github.com/repos/${this.organization}/${this.repo}/contributors`
      );
      if (response.ok) {
        const data = await response.json();
        this.contributors = data;
      }
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(RpgCharacter.tag, RpgCharacter);
