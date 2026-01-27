<template>
  <div class="template-builder" :style="containerStyle">
    <!-- Header -->
    <header class="flow-header">
      <div class="header-left">
        <!-- Logo -->
        <div class="header-logo">
          <img
            v-if="logoUrl && !logoError"
            :src="logoUrl"
            alt="Logo"
            class="header-logo-img"
            @load="handleLogoLoad"
            @error="handleLogoError"
          />
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#7c3aed"/>
          </svg>
        </div>
        <!-- Template Name (editable on double-click) -->
        <input
          v-if="isEditingName"
          ref="nameInput"
          v-model="editingNameValue"
          class="header-flow-name-input"
          @blur="finishEditingName"
          @keydown.enter="finishEditingName"
          @keydown.escape="cancelEditingName"
        />
        <template v-else>
          <span
            class="header-flow-name"
            @dblclick="startEditingName"
            title="Clique duas vezes para editar"
          >{{ templateNameInternal }}</span>
          <button
            class="header-edit-btn"
            @click="startEditingName"
            title="Editar nome do template"
            :disabled="readOnlyMode"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        </template>
      </div>
      <div class="header-right">
        <button class="header-btn header-btn-secondary" @click="handleBack">
          <span>Voltar</span>
        </button>
        <button
          class="header-btn header-btn-primary"
          :class="{ 'header-btn-disabled': !isValidInternal }"
          :disabled="!isValidInternal || readOnlyMode"
          @click="handleSave"
          :title="!isValidInternal ? 'Preencha o corpo da mensagem antes de salvar' : 'Salvar template'"
        >
          <span>Salvar</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="builder-content">
      <!-- Left Panel - Configuration -->
      <aside class="config-panel" :style="{ width: content?.panelWidth || '460px' }">
        <div class="panel-scroll">
          <h2 class="panel-title">Conteudo</h2>

          <!-- Body Section -->
          <section class="config-section">
            <div class="section-header" @click="toggleSection('body')">
              <h3 class="section-title">Body</h3>
              <svg
                class="chevron"
                :class="{ 'rotated': !expandedSections.body }"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <div v-show="expandedSections.body" class="section-content">
              <!-- Variables Toolbar -->
              <div class="formatting-toolbar">
                <div class="variables-dropdown" ref="variablesDropdownRef">
                  <button
                    ref="variablesBtnRef"
                    class="format-btn variables-btn has-tooltip"
                    @click="toggleVariablesDropdown"
                    :disabled="readOnlyMode"
                  >
                    <span class="custom-tooltip">Adicionar personalização</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </button>
                  <div
                    v-if="showVariablesDropdown"
                    class="dropdown-menu"
                    :style="dropdownPosition"
                  >
                    <template v-for="(variables, category) in groupedVariables" :key="category">
                      <div class="dropdown-category">{{ category }}</div>
                      <button
                        v-for="variable in variables"
                        :key="variable.value"
                        class="dropdown-item"
                        @click="insertVariable(variable)"
                      >
                        {{ variable.label }}
                        <span class="variable-value">{{ variable.value }}</span>
                      </button>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Body Textarea -->
              <div class="field-group">
                <div class="textarea-wrapper">
                  <textarea
                    ref="bodyTextarea"
                    :value="bodyContentInternal"
                    @input="handleBodyInput"
                    class="textarea-field"
                    placeholder="Digite a mensagem..."
                    :maxlength="maxBodyLength"
                    :disabled="readOnlyMode"
                    rows="6"
                  ></textarea>
                  <span class="char-counter">{{ bodyContentInternal?.length || 0 }} / {{ maxBodyLength }}</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </aside>

      <!-- Right Panel - Preview -->
      <main v-if="showPreview" class="preview-panel">
        <div class="preview-container">
          <!-- Phone Frame -->
          <div class="phone-frame sms-style">
            <div class="phone-notch"></div>
            <div class="phone-screen sms-screen">
              <!-- iOS SMS Header -->
              <div class="sms-header">
                <div class="sms-header-back">
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                    <path d="M10 2L2 10L10 18" stroke="#007AFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="sms-back-count">1</span>
                </div>
                <div class="sms-header-center">
                  <div class="sms-avatar">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" fill="#8E8E93"/>
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#8E8E93"/>
                    </svg>
                  </div>
                  <span class="sms-contact-number">8003</span>
                </div>
                <div class="sms-header-right"></div>
              </div>

              <!-- Chat Area -->
              <div class="sms-chat">
                <!-- Timestamp -->
                <div class="sms-timestamp">{{ currentTime }}</div>

                <!-- Message Bubble -->
                <div class="sms-bubble">
                  <div v-if="bodyContentInternal" class="sms-text" v-html="formatMessageBody(bodyContentInternal)">
                  </div>
                  <div v-else class="sms-text placeholder">
                    Sua mensagem aparecera aqui...
                  </div>
                </div>
              </div>

              <!-- iOS Input Area -->
              <div class="sms-input-area">
                <div class="sms-input-plus">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="#8E8E93" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="sms-input-field">
                  <span>Text Message</span>
                </div>
                <div class="sms-input-mic">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="12" rx="3" fill="#8E8E93"/>
                    <path d="M5 10v1a7 7 0 0014 0v-1M12 19v3M8 22h8" stroke="#8E8E93" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Back Confirmation Modal -->
    <transition name="fade">
      <div v-if="showBackConfirm" class="modal-overlay" @click.self="cancelBack">
        <div class="modal-container">
          <h3 class="modal-title">Sair sem salvar?</h3>
          <p class="modal-message">
            Suas alterações ainda não foram salvas. Se você sair agora, todas as mudanças serão perdidas.
          </p>
          <div class="modal-footer">
            <button class="modal-btn modal-btn-cancel" @click="cancelBack">
              Continuar editando
            </button>
            <button class="modal-btn modal-btn-danger" @click="confirmBack">
              Sair sem salvar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Save Loader Overlay -->
    <transition name="fade">
      <div v-if="isSaving" class="loader-overlay">
        <div class="loader-container">
          <div class="loader-spinner"></div>
          <p class="loader-message">{{ saveMessage }}</p>
        </div>
      </div>
    </transition>

    <!-- Loading Template Overlay -->
    <transition name="fade">
      <div v-if="isLoadingTemplate" class="loader-overlay">
        <div class="loader-container">
          <div class="loader-spinner"></div>
          <p class="loader-message">Carregando template...</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

export default {
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },

  emits: ['trigger-event'],

  setup(props, { emit }) {
    // ============================================
    // REFS
    // ============================================
    const nameInput = ref(null)
    const imageInput = ref(null)
    const bodyTextarea = ref(null)
    const variablesDropdownRef = ref(null)
    const variablesBtnRef = ref(null)
    const emojiDropdownRef = ref(null)
    const emojiBtnRef = ref(null)
    const isEditingName = ref(false)
    const editingNameValue = ref('')
    const showVariablesDropdown = ref(false)
    const showEmojiDropdown = ref(false)
    const selectedEmojiCategory = ref('smileys')
    const dropdownPosition = ref({})
    const emojiDropdownPosition = ref({})

    // Emoji categories data (like iPhone)
    const emojiCategories = [
      { name: 'recentes', label: 'Recentes', icon: '🕐' },
      { name: 'smileys', label: 'Smileys', icon: '😊' },
      { name: 'pessoas', label: 'Pessoas', icon: '👋' },
      { name: 'animais', label: 'Animais', icon: '🐶' },
      { name: 'comida', label: 'Comida', icon: '🍔' },
      { name: 'atividades', label: 'Atividades', icon: '⚽' },
      { name: 'viagens', label: 'Viagens', icon: '🚗' },
      { name: 'objetos', label: 'Objetos', icon: '💡' },
      { name: 'simbolos', label: 'Simbolos', icon: '❤️' },
      { name: 'bandeiras', label: 'Bandeiras', icon: '🏳️' },
    ]

    const emojisData = {
      recentes: ['😊', '❤️', '👍', '🎉', '✨', '🔥', '💯', '🙏'],
      smileys: [
        // Smileys & Emotion
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲',
        '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😶‍🌫️', '😏', '😒', '🙄', '😬', '😮‍💨', '🤥',
        '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '😵‍💫', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐',
        '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱',
        '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖',
        '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
        '🙈', '🙉', '🙊',
        '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️‍🔥', '❤️‍🩹', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍',
        '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤'
      ],
      pessoas: [
        // Hands
        '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜',
        '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄',
        // People
        '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷',
        '👮', '🕵️', '💂', '🥷', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟',
        '💆', '💇', '🚶', '🧍', '🧎', '🏃', '💃', '🕺', '🕴️', '👯', '🧖', '🧗', '🤸', '🏌️', '🏇', '⛷️', '🏂', '🏋️', '🤼', '🤽', '🤾', '🤺', '⛹️', '🏊', '🚣', '🧘',
        '🛀', '🛌',
        // Family & Couples
        '👭', '👫', '👬', '💏', '💑', '👪', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👨‍👦', '👨‍👦‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👧‍👧', '👩‍👦', '👩‍👦‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👧‍👧',
        '🗣️', '👤', '👥', '🫂'
      ],
      animais: [
        // Animals
        '🐶', '🐕', '🦮', '🐕‍🦺', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈‍⬛', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦫', '🦔', '🦇', '🐻', '🐻‍❄️', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡',
        '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖',
        '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🐌', '🦋', '🐛', '🐜', '🐝', '🪲', '🐞', '🦗', '🪳', '🕷️', '🕸️', '🦂', '🦟', '🪰', '🪱', '🦠',
        // Plants
        '💐', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃',
        // Nature
        '🌍', '🌎', '🌏', '🌐', '🪨', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '☀️', '🌝', '🌞', '🪐', '⭐', '🌟', '✨', '🌠', '🌌', '☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☂️', '☔', '⛱️', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌊'
      ],
      comida: [
        // Fruits
        '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥',
        // Vegetables
        '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰',
        // Bread & Grains
        '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀',
        // Meat & Protein
        '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂',
        // Asian Food
        '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡',
        // Seafood
        '🦀', '🦞', '🦐', '🦑', '🦪',
        // Sweets
        '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯',
        // Drinks
        '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊',
        // Utensils
        '🥢', '🍽️', '🍴', '🥄', '🔪', '🏺'
      ],
      atividades: [
        // Events
        '🎃', '🎄', '🎆', '🎇', '🧨', '✨', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🧧', '🎀', '🎁', '🎗️', '🎟️', '🎫',
        // Sports
        '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌',
        // Games
        '🎯', '🪀', '🪁', '🎱', '🔮', '🪄', '🧿', '🎮', '🕹️', '🎰', '🎲', '🧩', '🧸', '🪆', '♠️', '♥️', '♦️', '♣️', '♟️', '🃏', '🀄', '🎴',
        // Arts & Crafts
        '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '🪢'
      ],
      viagens: [
        // Transport - Ground
        '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🚏', '🛣️', '🛤️',
        // Transport - Air & Sea
        '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '⛵', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸',
        // Places
        '🌍', '🌎', '🌏', '🗺️', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🪨', '🪵', '🛖', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋',
        // Other Places
        '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪',
        // Time
        '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡️', '☀️', '🌝', '🌞', '🪐', '⭐', '🌟', '🌠'
      ],
      objetos: [
        // Clothing
        '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍️', '🎒', '🩴', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '🪖', '⛑️', '📿', '💄', '💍', '💎',
        // Sound
        '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕',
        // Music
        '🎼', '🎵', '🎶', '🎙️', '🎚️', '🎛️', '🎤', '🎧', '📻', '🎷', '🪗', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪘',
        // Phone & Computer
        '📱', '📲', '☎️', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🧮',
        // Camera & Video
        '🎥', '🎞️', '📽️', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯️', '💡', '🔦', '🏮', '🪔',
        // Book & Paper
        '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️',
        // Money
        '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹',
        // Mail
        '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️',
        // Writing
        '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝',
        // Office
        '💼', '📁', '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️',
        // Lock
        '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️',
        // Tools
        '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🪃', '🏹', '🛡️', '🪚', '🔧', '🪛', '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🪝', '🧰', '🧲',
        // Science
        '🧪', '🧫', '🧬', '🔬', '🔭', '📡',
        // Medical
        '💉', '🩸', '💊', '🩹', '🩺',
        // Household
        '🚪', '🛗', '🪞', '🪟', '🛏️', '🛋️', '🪑', '🚽', '🪠', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🧼', '🪥', '🧽', '🧯', '🛒',
        // Other Objects
        '🚬', '⚰️', '🪦', '⚱️', '🗿', '🪧', '🏧'
      ],
      simbolos: [
        // Hearts
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️',
        // Symbols
        '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭',
        // Arrows & Shapes
        '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣',
        // Numbers & Letters
        'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣',
        // Buttons & Controls
        '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶',
        // Geometric
        '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢',
        // Other
        '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'
      ],
      bandeiras: [
        // Flags
        '🏳️', '🏴', '🏴‍☠️', '🏁', '🚩', '🎌', '🏳️‍🌈', '🏳️‍⚧️',
        // Countries
        '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿',
        '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿',
        '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿',
        '🇩🇪', '🇩🇬', '🇩🇯', '🇩🇰', '🇩🇲', '🇩🇴', '🇩🇿',
        '🇪🇦', '🇪🇨', '🇪🇪', '🇪🇬', '🇪🇭', '🇪🇷', '🇪🇸', '🇪🇹', '🇪🇺',
        '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷',
        '🇬🇦', '🇬🇧', '🇬🇩', '🇬🇪', '🇬🇫', '🇬🇬', '🇬🇭', '🇬🇮', '🇬🇱', '🇬🇲', '🇬🇳', '🇬🇵', '🇬🇶', '🇬🇷', '🇬🇸', '🇬🇹', '🇬🇺', '🇬🇼', '🇬🇾',
        '🇭🇰', '🇭🇲', '🇭🇳', '🇭🇷', '🇭🇹', '🇭🇺',
        '🇮🇨', '🇮🇩', '🇮🇪', '🇮🇱', '🇮🇲', '🇮🇳', '🇮🇴', '🇮🇶', '🇮🇷', '🇮🇸', '🇮🇹',
        '🇯🇪', '🇯🇲', '🇯🇴', '🇯🇵',
        '🇰🇪', '🇰🇬', '🇰🇭', '🇰🇮', '🇰🇲', '🇰🇳', '🇰🇵', '🇰🇷', '🇰🇼', '🇰🇾', '🇰🇿',
        '🇱🇦', '🇱🇧', '🇱🇨', '🇱🇮', '🇱🇰', '🇱🇷', '🇱🇸', '🇱🇹', '🇱🇺', '🇱🇻', '🇱🇾',
        '🇲🇦', '🇲🇨', '🇲🇩', '🇲🇪', '🇲🇫', '🇲🇬', '🇲🇭', '🇲🇰', '🇲🇱', '🇲🇲', '🇲🇳', '🇲🇴', '🇲🇵', '🇲🇶', '🇲🇷', '🇲🇸', '🇲🇹', '🇲🇺', '🇲🇻', '🇲🇼', '🇲🇽', '🇲🇾', '🇲🇿',
        '🇳🇦', '🇳🇨', '🇳🇪', '🇳🇫', '🇳🇬', '🇳🇮', '🇳🇱', '🇳🇴', '🇳🇵', '🇳🇷', '🇳🇺', '🇳🇿',
        '🇴🇲',
        '🇵🇦', '🇵🇪', '🇵🇫', '🇵🇬', '🇵🇭', '🇵🇰', '🇵🇱', '🇵🇲', '🇵🇳', '🇵🇷', '🇵🇸', '🇵🇹', '🇵🇼', '🇵🇾',
        '🇶🇦',
        '🇷🇪', '🇷🇴', '🇷🇸', '🇷🇺', '🇷🇼',
        '🇸🇦', '🇸🇧', '🇸🇨', '🇸🇩', '🇸🇪', '🇸🇬', '🇸🇭', '🇸🇮', '🇸🇯', '🇸🇰', '🇸🇱', '🇸🇲', '🇸🇳', '🇸🇴', '🇸🇷', '🇸🇸', '🇸🇹', '🇸🇻', '🇸🇽', '🇸🇾', '🇸🇿',
        '🇹🇦', '🇹🇨', '🇹🇩', '🇹🇫', '🇹🇬', '🇹🇭', '🇹🇯', '🇹🇰', '🇹🇱', '🇹🇲', '🇹🇳', '🇹🇴', '🇹🇷', '🇹🇹', '🇹🇻', '🇹🇼', '🇹🇿',
        '🇺🇦', '🇺🇬', '🇺🇲', '🇺🇳', '🇺🇸', '🇺🇾', '🇺🇿',
        '🇻🇦', '🇻🇨', '🇻🇪', '🇻🇬', '🇻🇮', '🇻🇳', '🇻🇺',
        '🇼🇫', '🇼🇸',
        '🇽🇰',
        '🇾🇪', '🇾🇹',
        '🇿🇦', '🇿🇲', '🇿🇼',
        '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🏴󠁧󠁢󠁷󠁬󠁳󠁿'
      ]
    }
    const logoError = ref(false)

    // Logo URL - using Supabase URL directly to avoid WeWeb CDN issues
    const logoUrl = computed(() => {
      const url = props.content?.logoUrl || 'https://rposipkylgypxzqucjae.supabase.co/storage/v1/object/public/flashcrm/logoflashSemFundo.png'
      return url
    })

    // Reset logo error when URL changes
    watch(() => props.content?.logoUrl, () => {
      logoError.value = false
    })

    // Logo event handlers
    const handleLogoLoad = () => {
      // Logo loaded successfully
    }

    const handleLogoError = () => {
      logoError.value = true
    }

    const showHeaderImage = ref(false)
    const showBackConfirm = ref(false)
    const isSaving = ref(false)
    const saveMessage = ref('')
    const selectedImageFile = ref(null) // Armazena o File object para upload
    const isLoadingTemplate = ref(false) // Estado de carregamento do template
    const editingTemplateId = ref(null) // ID do template em edição (persiste entre remounts)
    const expandedSections = ref({
      header: true,
      body: true,
      footer: false,
      buttons: false,
    })

    // ============================================
    // INTERNAL VARIABLES (using wwLib)
    // ============================================
    const { value: templateNameInternal, setValue: setTemplateName } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'templateName',
      type: 'string',
      defaultValue: 'Novo Template',
    })

    const { value: headerTypeInternal, setValue: setHeaderType } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'headerType',
      type: 'string',
      defaultValue: 'none',
    })

    const { value: headerContentInternal, setValue: setHeaderContent } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'headerContent',
      type: 'string',
      defaultValue: '',
    })

    const { value: headerImageUrlInternal, setValue: setHeaderImageUrl } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'headerImageUrl',
      type: 'string',
      defaultValue: '',
    })

    const { value: bodyContentInternal, setValue: setBodyContent } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'bodyContent',
      type: 'string',
      defaultValue: '',
    })

    const { value: footerContentInternal, setValue: setFooterContent } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'footerContent',
      type: 'string',
      defaultValue: '',
    })

    const { value: buttonsInternal, setValue: setButtons } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'buttons',
      type: 'array',
      defaultValue: [],
    })

    const { value: isValidInternal, setValue: setIsValid } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'isValid',
      type: 'boolean',
      defaultValue: false,
    })

    const { value: validationErrorsInternal, setValue: setValidationErrors } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'validationErrors',
      type: 'array',
      defaultValue: [],
    })

    const { value: isDirtyInternal, setValue: setIsDirty } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'isDirty',
      type: 'boolean',
      defaultValue: false,
    })

    const { value: loadedTemplateIdInternal, setValue: setLoadedTemplateId } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'loadedTemplateId',
      type: 'number',
      defaultValue: null,
    })

    const { setValue: setBodyCharCount } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'bodyCharCount',
      type: 'number',
      defaultValue: 0,
    })

    const { setValue: setHeaderCharCount } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'headerCharCount',
      type: 'number',
      defaultValue: 0,
    })

    // ============================================
    // EMPRESA ID - Fetch from user/empresa collection (with fallback to props)
    // ============================================
    const empresaId = computed(() => {
      try {
        const collections = wwLib.$store.getters['data/getCollections']
        const idFromCollection = collections?.['2a7ebac6-154a-4af7-8337-411e42e6a35c']?.data?.[0]?.empresa || null
        const finalId = idFromCollection || props.content?.empresaId || null
        console.log('[TEMPLATE-BUILDER] empresaId computed - from collection:', idFromCollection, '| from props:', props.content?.empresaId, '| final:', finalId)
        return finalId
      } catch (e) {
        console.error('[TEMPLATE-BUILDER] Erro ao buscar empresaId:', e)
        return props.content?.empresaId || null
      }
    })

    // ============================================
    // COMPUTED
    // ============================================
    const containerStyle = computed(() => ({
      '--builder-height': props.content?.height || '100vh',
      '--builder-bg': props.content?.backgroundColor || '#f8fafc',
      '--panel-width': props.content?.panelWidth || '460px',
    }))

    const readOnlyMode = computed(() => props.content?.readOnly === true)

    const showPreview = computed(() => props.content?.showPreview !== false)

    const maxBodyLength = computed(() => props.content?.maxBodyLength || 1024)

    const maxHeaderLength = computed(() => props.content?.maxHeaderLength || 60)

    const maxFooterLength = computed(() => props.content?.maxFooterLength || 60)

    const maxButtons = computed(() => props.content?.maxButtons || 3)

    const availableVariables = computed(() => props.content?.availableVariables || [
      // Cliente
      { value: '{{nome_cliente}}', label: 'Nome', category: 'Cliente' },
      { value: '{{sobrenome}}', label: 'Sobrenome', category: 'Cliente' },
      { value: '{{email}}', label: 'E-mail', category: 'Cliente' },
      { value: '{{telefone}}', label: 'Telefone', category: 'Cliente' },
      // Pedido
      { value: '{{numero_pedido}}', label: 'Numero do Pedido', category: 'Pedido' },
      { value: '{{valor_pedido}}', label: 'Valor do Pedido', category: 'Pedido' },
      // Cashback
      { value: '{{valor_cashback}}', label: 'Valor do Cashback', category: 'Cashback' },
      { value: '{{cupom}}', label: 'Codigo do Cupom', category: 'Cashback' },
      { value: '{{data_vencimento}}', label: 'Data de Vencimento', category: 'Cashback' },
      { value: '{{data_ativacao}}', label: 'Data de Ativacao', category: 'Cashback' },
      { value: '{{compra_minima}}', label: 'Compra Minima', category: 'Cashback' },
      { value: '{{desconto_max}}', label: 'Desconto Maximo', category: 'Cashback' },
    ])

    // Group variables by category
    const groupedVariables = computed(() => {
      const vars = availableVariables.value || []
      const groups = {}
      vars.forEach(v => {
        const cat = v.category || 'Outros'
        if (!groups[cat]) {
          groups[cat] = []
        }
        groups[cat].push(v)
      })
      return groups
    })

    // Current emojis based on selected category
    const currentEmojis = computed(() => {
      return emojisData[selectedEmojiCategory.value] || emojisData.smileys
    })

    const currentTime = computed(() => {
      const now = new Date()
      return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    })

    // ============================================
    // WATCHERS - Initialize from props
    // ============================================
    watch(() => props.content?.templateName, (newVal) => {
      if (newVal && newVal !== templateNameInternal.value) {
        setTemplateName(newVal)
      }
    }, { immediate: true })

    watch(() => props.content?.initialHeaderType, (newVal) => {
      if (newVal !== undefined) {
        setHeaderType(newVal)
      }
    }, { immediate: true })

    watch(() => props.content?.initialHeaderContent, (newVal) => {
      if (newVal !== undefined) {
        setHeaderContent(newVal)
      }
    }, { immediate: true })

    watch(() => props.content?.initialHeaderImageUrl, (newVal) => {
      if (newVal !== undefined) {
        setHeaderImageUrl(newVal)
        // If there's an initial image, show the header image section
        if (newVal) {
          showHeaderImage.value = true
        }
      }
    }, { immediate: true })

    watch(() => props.content?.initialBodyContent, (newVal) => {
      if (newVal !== undefined) {
        setBodyContent(newVal)
      }
    }, { immediate: true })

    watch(() => props.content?.initialFooterContent, (newVal) => {
      if (newVal !== undefined) {
        setFooterContent(newVal)
      }
    }, { immediate: true })

    watch(() => props.content?.initialButtons, (newVal) => {
      if (Array.isArray(newVal)) {
        setButtons([...newVal])
      }
    }, { immediate: true })

    watch(() => props.content?.templateId, async (newVal, oldVal) => {
      console.log('[TEMPLATE-BUILDER] Watch templateId mudou:', oldVal, '->', newVal)
      if (newVal && newVal !== oldVal && newVal !== editingTemplateId.value) {
        console.log('[TEMPLATE-BUILDER] Carregando template do banco via watch...')
        editingTemplateId.value = newVal
        setLoadedTemplateId(newVal)
        await loadTemplateFromDatabase(newVal)
      } else if (newVal !== undefined) {
        setLoadedTemplateId(newVal)
      }
    }, { immediate: true })

    // Clear header image when unchecking the option
    watch(showHeaderImage, (newVal) => {
      if (!newVal && headerImageUrlInternal.value) {
        setHeaderImageUrl('')
        markDirty()
      }
    })

    // Update char counts
    watch(bodyContentInternal, (newVal) => {
      setBodyCharCount(newVal?.length || 0)
      markDirty()
    })

    watch(headerContentInternal, (newVal) => {
      setHeaderCharCount(newVal?.length || 0)
      markDirty()
    })

    // Validate on content changes
    watch([headerTypeInternal, headerContentInternal, headerImageUrlInternal, bodyContentInternal, footerContentInternal, buttonsInternal], () => {
      validate()
    }, { deep: true })

    // ============================================
    // METHODS
    // ============================================
    const markDirty = () => {
      if (!isDirtyInternal.value) {
        setIsDirty(true)
      }
    }

    const validate = () => {
      const errors = []

      // Body is required
      if (!bodyContentInternal.value || bodyContentInternal.value.trim().length === 0) {
        errors.push('O corpo da mensagem e obrigatorio')
      }

      // Header image is optional - no validation needed

      // Validate buttons
      const buttons = buttonsInternal.value || []
      buttons.forEach((btn, index) => {
        if (!btn.text || btn.text.trim().length === 0) {
          errors.push(`O texto do botao ${index + 1} e obrigatorio`)
        }
        if (btn.type === 'url' && (!btn.url || !btn.url.startsWith('http'))) {
          errors.push(`A URL do botao ${index + 1} e invalida`)
        }
        if (btn.type === 'phone' && (!btn.phone || btn.phone.trim().length === 0)) {
          errors.push(`O telefone do botao ${index + 1} e obrigatorio`)
        }
      })

      setValidationErrors(errors)
      setIsValid(errors.length === 0)

      emit('trigger-event', {
        name: 'validation-change',
        event: { isValid: errors.length === 0, errors }
      })
    }

    const getTemplateData = () => ({
      nome: templateNameInternal.value,
      tipo: 'sms',
      body: bodyContentInternal.value,
    })

    // ============================================
    // LOAD TEMPLATE FROM DATABASE
    // ============================================
    const loadTemplateFromDatabase = async (templateId) => {
      console.log('[TEMPLATE-BUILDER] ========================================')
      console.log('[TEMPLATE-BUILDER] loadTemplateFromDatabase INICIADO')
      console.log('[TEMPLATE-BUILDER] Template ID:', templateId)

      const currentEmpresaId = empresaId.value
      console.log('[TEMPLATE-BUILDER] Empresa ID:', currentEmpresaId)

      if (!currentEmpresaId) {
        console.error('[TEMPLATE-BUILDER] ❌ empresa_id não configurado!')
        emit('trigger-event', {
          name: 'load-error',
          event: { error: 'empresa_id não configurado', templateId },
        })
        return false
      }

      const supabase = wwLib?.wwPlugins?.supabase?.instance
      console.log('[TEMPLATE-BUILDER] Supabase disponível:', !!supabase)

      if (!supabase) {
        console.error('[TEMPLATE-BUILDER] ❌ Supabase plugin não disponível!')
        emit('trigger-event', {
          name: 'load-error',
          event: { error: 'Supabase plugin não disponível', templateId },
        })
        return false
      }

      isLoadingTemplate.value = true
      console.log('[TEMPLATE-BUILDER] Buscando template no banco...')

      try {
        const { data, error } = await supabase
          .from('message_templates')
          .select('*')
          .eq('id', parseInt(templateId))
          .eq('empresa_id', currentEmpresaId)
          .single()

        console.log('[TEMPLATE-BUILDER] Resposta do Supabase:')
        console.log('[TEMPLATE-BUILDER] - data:', data)
        console.log('[TEMPLATE-BUILDER] - error:', error)

        if (error) {
          console.error('[TEMPLATE-BUILDER] ❌ Erro na query:', error.message)
          emit('trigger-event', {
            name: 'load-error',
            event: { error: error.message, templateId },
          })
          return false
        }

        if (!data) {
          console.error('[TEMPLATE-BUILDER] ❌ Template não encontrado!')
          emit('trigger-event', {
            name: 'load-error',
            event: { error: 'Template não encontrado', templateId },
          })
          return false
        }

        console.log('[TEMPLATE-BUILDER] ✓ Template encontrado! Preenchendo campos...')

        // Armazenar o ID do template carregado
        setLoadedTemplateId(data.id)
        editingTemplateId.value = data.id // Garantir persistência entre remounts
        console.log('[TEMPLATE-BUILDER] ✓ setLoadedTemplateId:', data.id, '/ editingTemplateId:', editingTemplateId.value)

        // Preencher os campos com os dados do template
        setTemplateName(data.nome || 'Novo Template')
        console.log('[TEMPLATE-BUILDER] ✓ setTemplateName:', data.nome)

        setBodyContent(data.conteudo || '')
        console.log('[TEMPLATE-BUILDER] ✓ setBodyContent:', data.conteudo?.substring(0, 50))

        setFooterContent(data.footer || '')
        console.log('[TEMPLATE-BUILDER] ✓ setFooterContent:', data.footer)

        // Se tem imagem, mostrar o header de imagem
        if (data.midia_url) {
          setHeaderImageUrl(data.midia_url)
          showHeaderImage.value = true
          setHeaderType('image')
          console.log('[TEMPLATE-BUILDER] ✓ Imagem configurada:', data.midia_url)
        } else {
          setHeaderImageUrl('')
          showHeaderImage.value = false
          setHeaderType('none')
          console.log('[TEMPLATE-BUILDER] Template sem imagem')
        }

        // Resetar flag de alterações (template recém carregado)
        setIsDirty(false)

        // Emitir evento de sucesso
        emit('trigger-event', {
          name: 'load',
          event: { success: true, template: data },
        })

        console.log('[TEMPLATE-BUILDER] ✅ TEMPLATE CARREGADO COM SUCESSO!')
        console.log('[TEMPLATE-BUILDER] ========================================')

        return true

      } catch (err) {
        console.error('[TEMPLATE-BUILDER] ❌ ERRO:', err)
        emit('trigger-event', {
          name: 'load-error',
          event: { error: err?.message || 'Erro ao carregar template', templateId },
        })
        return false
      } finally {
        isLoadingTemplate.value = false
      }
    }

    // ============================================
    // BACK BUTTON HANDLERS
    // ============================================
    const handleBack = () => {
      showBackConfirm.value = true
    }

    const cancelBack = () => {
      showBackConfirm.value = false
    }

    const confirmBack = () => {
      showBackConfirm.value = false

      // Emite o evento para o workflow
      emit('trigger-event', {
        name: 'back',
        event: {},
      })
    }

    // ============================================
    // SAVE BUTTON HANDLERS
    // ============================================

    // Função para upload de imagem para o Storage
    const uploadImageToStorage = async (file, empresaId) => {
      const supabase = wwLib.wwPlugins?.supabase?.instance
      if (!supabase) {
        throw new Error('Plugin Supabase não encontrado')
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`

      // Path DEVE começar com empresa_id (exigido pela RLS policy)
      const filePath = `${empresaId}/templates/${fileName}`

      // Upload para o bucket
      const { data, error } = await supabase.storage
        .from('template-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(`Erro no upload: ${error.message}`)
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('template-images')
        .getPublicUrl(filePath)

      return {
        publicUrl: urlData.publicUrl,
        path: filePath
      }
    }

    const handleSave = async () => {
      // Validar template
      validate()

      if (!isValidInternal.value) {
        emit('trigger-event', {
          name: 'save',
          event: {
            success: false,
            message: 'Template inválido',
            error: validationErrorsInternal.value.join(', '),
            template: getTemplateData(),
          }
        })
        return
      }

      // Iniciar processo de salvamento (mostra loader)
      isSaving.value = true
      saveMessage.value = 'Salvando template...'

      try {
        const currentEmpresaId = empresaId.value

        if (!currentEmpresaId) {
          throw new Error('empresa_id não configurado')
        }

        // Verificar disponibilidade do Supabase
        const supabase = wwLib?.wwPlugins?.supabase?.instance
        if (!supabase) {
          throw new Error('Supabase plugin não disponível')
        }

        // Montar payload para a tabela message_templates (SMS não tem imagem)
        const templatePayload = {
          empresa_id: currentEmpresaId,
          nome: templateNameInternal.value || 'Novo Template',
          tipo: 'sms',
          midia_url: null,
          midia_tipo: null,
          conteudo: bodyContentInternal.value || '',
          ativo: true
        }

        // Se está editando template existente, adicionar o id
        const templateId = loadedTemplateIdInternal.value || editingTemplateId.value || props.content?.templateId
        console.log('[TEMPLATE-BUILDER] templateId para salvar:', templateId, '(loadedTemplateIdInternal:', loadedTemplateIdInternal.value, ', editingTemplateId:', editingTemplateId.value, ')')
        if (templateId) {
          templatePayload.id = parseInt(templateId) // Garantir que é número
        }

        // Fazer upsert na tabela message_templates
        const { data, error } = await supabase
          .from('message_templates')
          .upsert(templatePayload, { onConflict: 'id' })
          .select()
          .single()

        if (error) {
          throw new Error(error.message || 'Erro ao salvar template')
        }

        // Sucesso!
        // Atualizar ID do template se era novo
        if (data?.id && !loadedTemplateIdInternal.value) {
          setLoadedTemplateId(data.id)
        }

        // Resetar flag de alterações
        setIsDirty(false)

        // Limpar arquivo selecionado
        selectedImageFile.value = null

        // Emitir evento de sucesso
        emit('trigger-event', {
          name: 'save',
          event: {
            success: true,
            message: 'Template salvo com sucesso!',
            error: '',
            template: data,
            templateId: data?.id,
          },
        })

        saveMessage.value = 'Template salvo!'

        // Emitir evento save-complete após um breve delay
        setTimeout(() => {
          isSaving.value = false
          emit('trigger-event', {
            name: 'save-complete',
            event: { templateId: data?.id }
          })
        }, 800)

      } catch (err) {
        isSaving.value = false
        saveMessage.value = ''

        emit('trigger-event', {
          name: 'save',
          event: {
            success: false,
            error: err?.message || 'Erro inesperado ao salvar template',
            template: getTemplateData(),
          },
        })
      }
    }

    const startEditingName = () => {
      if (readOnlyMode.value) return
      isEditingName.value = true
      editingNameValue.value = templateNameInternal.value
      nextTick(() => {
        nameInput.value?.focus()
        nameInput.value?.select()
      })
    }

    const finishEditingName = () => {
      const oldName = templateNameInternal.value
      const newName = editingNameValue.value.trim() || 'Novo Template'
      if (newName !== oldName) {
        setTemplateName(newName)
        markDirty()
        emit('trigger-event', {
          name: 'template-name-change',
          event: { oldName, newName }
        })
      }
      isEditingName.value = false
    }

    const cancelEditingName = () => {
      isEditingName.value = false
      editingNameValue.value = templateNameInternal.value
    }

    const toggleSection = (section) => {
      expandedSections.value[section] = !expandedSections.value[section]
    }

    const triggerImageUpload = () => {
      if (readOnlyMode.value) return
      imageInput.value?.click()
    }

    const handleImageSelect = (event) => {
      const file = event.target.files?.[0]
      if (file) {
        // Validar tipo de arquivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          emit('trigger-event', {
            name: 'image-upload',
            event: { url: null, file: null, error: 'Tipo de arquivo não permitido. Use: JPG, PNG, GIF ou WebP' }
          })
          return
        }
        // Validar tamanho (5MB)
        if (file.size > 5 * 1024 * 1024) {
          emit('trigger-event', {
            name: 'image-upload',
            event: { url: null, file: null, error: 'Arquivo muito grande. Tamanho máximo: 5MB' }
          })
          return
        }

        // Armazena o arquivo para upload posterior
        selectedImageFile.value = file

        const reader = new FileReader()
        reader.onload = (e) => {
          setHeaderImageUrl(e.target.result)
          markDirty()
          emit('trigger-event', {
            name: 'image-upload',
            event: { url: e.target.result, file, error: null }
          })
        }
        reader.readAsDataURL(file)
      }
    }

    const onDragOver = (event) => {
      event.currentTarget.classList.add('dragover')
    }

    const onDragLeave = (event) => {
      event.currentTarget.classList.remove('dragover')
    }

    const onDrop = (event) => {
      event.currentTarget.classList.remove('dragover')
      const file = event.dataTransfer.files?.[0]
      if (file && file.type.startsWith('image/')) {
        // Validar tamanho
        if (file.size > 5 * 1024 * 1024) {
          return
        }
        // Armazena o arquivo
        selectedImageFile.value = file

        const reader = new FileReader()
        reader.onload = (e) => {
          setHeaderImageUrl(e.target.result)
          markDirty()
        }
        reader.readAsDataURL(file)
      }
    }

    const removeHeaderImage = () => {
      setHeaderImageUrl('')
      selectedImageFile.value = null
      markDirty()
    }

    const toggleHeaderImage = () => {
      if (readOnlyMode.value) return
      showHeaderImage.value = !showHeaderImage.value
    }

    const handleBodyInput = (event) => {
      setBodyContent(event.target.value)
    }

    const toggleVariablesDropdown = () => {
      // Close emoji dropdown if open
      showEmojiDropdown.value = false

      if (!showVariablesDropdown.value && variablesBtnRef.value) {
        // Calculate position based on button location
        const btn = variablesBtnRef.value
        const rect = btn.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        // Position below button by default
        let top = rect.bottom + 8
        let left = rect.left

        // Check if dropdown would go off-screen at the bottom
        const dropdownHeight = 400 // max-height from CSS
        if (top + dropdownHeight > viewportHeight - 20) {
          // Position above button instead
          top = rect.top - dropdownHeight - 8
          if (top < 20) {
            top = 20 // Minimum top position
          }
        }

        // Ensure left doesn't go off-screen
        if (left + 280 > window.innerWidth - 20) {
          left = window.innerWidth - 280 - 20
        }
        if (left < 20) {
          left = 20
        }

        dropdownPosition.value = {
          top: `${top}px`,
          left: `${left}px`,
        }
      }
      showVariablesDropdown.value = !showVariablesDropdown.value
    }

    const toggleEmojiDropdown = () => {
      // Close variables dropdown if open
      showVariablesDropdown.value = false

      if (!showEmojiDropdown.value && emojiBtnRef.value) {
        // Calculate position based on button location
        const btn = emojiBtnRef.value
        const rect = btn.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        // Position below button by default
        let top = rect.bottom + 8
        let left = rect.left

        // Check if dropdown would go off-screen at the bottom
        const dropdownHeight = 380 // max-height from CSS
        if (top + dropdownHeight > viewportHeight - 20) {
          // Position above button instead
          top = rect.top - dropdownHeight - 8
          if (top < 20) {
            top = 20 // Minimum top position
          }
        }

        // Ensure left doesn't go off-screen
        if (left + 380 > window.innerWidth - 20) {
          left = window.innerWidth - 380 - 20
        }
        if (left < 20) {
          left = 20
        }

        emojiDropdownPosition.value = {
          top: `${top}px`,
          left: `${left}px`,
        }
      }
      showEmojiDropdown.value = !showEmojiDropdown.value
    }

    const insertEmoji = (emoji) => {
      const textarea = bodyTextarea.value
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = bodyContentInternal.value || ''
      const newText = text.substring(0, start) + emoji + text.substring(end)

      setBodyContent(newText)
      showEmojiDropdown.value = false
      markDirty()

      emit('trigger-event', {
        name: 'emoji-insert',
        event: { emoji, field: 'body' }
      })

      nextTick(() => {
        textarea.focus()
        const newPos = start + emoji.length
        textarea.setSelectionRange(newPos, newPos)
      })
    }

    const insertVariable = (variable) => {
      const textarea = bodyTextarea.value
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = bodyContentInternal.value || ''
      const newText = text.substring(0, start) + variable.value + text.substring(end)

      setBodyContent(newText)
      showVariablesDropdown.value = false
      markDirty()

      emit('trigger-event', {
        name: 'variable-insert',
        event: { variable: variable.value, field: 'body' }
      })

      nextTick(() => {
        textarea.focus()
        const newPos = start + variable.value.length
        textarea.setSelectionRange(newPos, newPos)
      })
    }

    const insertFormat = (format) => {
      const textarea = bodyTextarea.value
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = bodyContentInternal.value || ''
      const selectedText = text.substring(start, end)

      let prefix = ''
      let suffix = ''

      switch (format) {
        case 'bold':
          prefix = '*'
          suffix = '*'
          break
        case 'italic':
          prefix = '_'
          suffix = '_'
          break
        case 'strike':
          prefix = '~'
          suffix = '~'
          break
        case 'code':
          prefix = '```'
          suffix = '```'
          break
      }

      const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end)
      setBodyContent(newText)
      markDirty()

      nextTick(() => {
        textarea.focus()
        if (selectedText) {
          textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length)
        } else {
          textarea.setSelectionRange(start + prefix.length, start + prefix.length)
        }
      })
    }

    const addButton = () => {
      if (readOnlyMode.value) return
      const buttons = buttonsInternal.value || []
      if (buttons.length >= maxButtons.value) return

      const newButton = {
        id: `btn_${Date.now()}`,
        type: 'quick_reply',
        text: '',
        url: '',
        phone: '',
      }

      setButtons([...buttons, newButton])
      markDirty()
      expandedSections.value.buttons = true

      emit('trigger-event', {
        name: 'button-add',
        event: { button: newButton }
      })
    }

    const removeButton = (buttonId) => {
      if (readOnlyMode.value) return
      const buttons = buttonsInternal.value || []
      setButtons(buttons.filter(b => b.id !== buttonId))
      markDirty()

      emit('trigger-event', {
        name: 'button-remove',
        event: { buttonId }
      })
    }

    const onButtonChange = () => {
      markDirty()
      emit('trigger-event', {
        name: 'content-change',
        event: { field: 'buttons', value: buttonsInternal.value, template: getTemplateData() }
      })
    }

    const formatMessageBody = (text) => {
      if (!text) return ''
      return text
        .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        .replace(/~([^~]+)~/g, '<s>$1</s>')
        .replace(/```([^`]+)```/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
    }

    // Close dropdowns when clicking outside and check for template ID in URL
    onMounted(async () => {
      console.log('[TEMPLATE-BUILDER] ========================================')
      console.log('[TEMPLATE-BUILDER] onMounted INICIADO')
      console.log('[TEMPLATE-BUILDER] ========================================')

      const doc = wwLib.getFrontDocument()
      if (doc) {
        doc.addEventListener('click', (e) => {
          if (!e.target.closest('.variables-dropdown')) {
            showVariablesDropdown.value = false
          }
          if (!e.target.closest('.emoji-dropdown')) {
            showEmojiDropdown.value = false
          }
        })
      }

      // Verificar se já estamos editando um template (proteção contra remount)
      console.log('[TEMPLATE-BUILDER] editingTemplateId atual:', editingTemplateId.value)

      if (editingTemplateId.value) {
        console.log('[TEMPLATE-BUILDER] Já estamos editando o template', editingTemplateId.value, '- ignorando verificação')
      } else {
        // Verificar props.content.templateId (configurado no editor WeWeb)
        const templateId = props.content?.templateId
        console.log('[TEMPLATE-BUILDER] templateId das props:', templateId)

        if (templateId) {
          console.log('[TEMPLATE-BUILDER] ID encontrado! Chamando loadTemplateFromDatabase...')
          editingTemplateId.value = templateId
          const result = await loadTemplateFromDatabase(templateId)
          console.log('[TEMPLATE-BUILDER] Resultado do carregamento:', result)
          if (!result) {
            editingTemplateId.value = null // Limpar se falhou
          }
        } else {
          console.log('[TEMPLATE-BUILDER] Nenhum templateId nas props - modo criação')
        }
      }

      validate()
      console.log('[TEMPLATE-BUILDER] onMounted FINALIZADO')
      console.log('[TEMPLATE-BUILDER] ========================================')
    })

    return {
      // Refs
      nameInput,
      imageInput,
      bodyTextarea,
      variablesDropdownRef,
      variablesBtnRef,
      emojiDropdownRef,
      emojiBtnRef,
      isEditingName,
      editingNameValue,
      showVariablesDropdown,
      showEmojiDropdown,
      selectedEmojiCategory,
      dropdownPosition,
      emojiDropdownPosition,
      logoUrl,
      logoError,
      showHeaderImage,
      showBackConfirm,
      isSaving,
      saveMessage,
      isLoadingTemplate,
      editingTemplateId,
      expandedSections,

      // Internal values
      templateNameInternal,
      headerTypeInternal,
      headerContentInternal,
      headerImageUrlInternal,
      bodyContentInternal,
      footerContentInternal,
      buttonsInternal,
      isValidInternal,
      validationErrorsInternal,
      loadedTemplateIdInternal,

      // Computed
      containerStyle,
      readOnlyMode,
      showPreview,
      maxBodyLength,
      maxHeaderLength,
      maxFooterLength,
      maxButtons,
      availableVariables,
      groupedVariables,
      emojiCategories,
      currentEmojis,
      currentTime,

      // Methods
      handleBack,
      cancelBack,
      confirmBack,
      handleSave,
      handleLogoLoad,
      handleLogoError,
      startEditingName,
      finishEditingName,
      cancelEditingName,
      toggleSection,
      triggerImageUpload,
      handleImageSelect,
      onDragOver,
      onDragLeave,
      onDrop,
      removeHeaderImage,
      toggleHeaderImage,
      handleBodyInput,
      toggleVariablesDropdown,
      toggleEmojiDropdown,
      insertVariable,
      insertEmoji,
      insertFormat,
      addButton,
      removeButton,
      onButtonChange,
      formatMessageBody,
    }
  },
}
</script>

<style lang="scss" scoped>
.template-builder {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: var(--builder-bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  z-index: 1000;
  overflow: hidden;
}

// ============================================
// HEADER (same as flow-builder)
// ============================================
.flow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-logo svg {
  width: 24px;
  height: 24px;
}

.header-logo-img {
  height: 28px;
  width: auto;
  max-width: 140px;
  object-fit: contain;
}

.header-flow-name {
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  letter-spacing: -0.01em;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.header-flow-name:hover {
  background-color: #f3f4f6;
}

.header-flow-name-input {
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  letter-spacing: -0.01em;
  padding: 4px 8px;
  border: 1px solid #7c3aed;
  border-radius: 4px;
  outline: none;
  min-width: 200px;
}

.header-edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.header-edit-btn:hover {
  color: #6b7280;
  background: #f3f4f6;
}

.header-edit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 19px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.header-btn svg {
  flex-shrink: 0;
}

.header-btn-secondary {
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.header-btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.header-btn-primary {
  background: #7c3aed;
  color: #ffffff;
  border: none;
}

.header-btn-primary:hover:not(:disabled) {
  background: #6d28d9;
}

.header-btn-primary:disabled,
.header-btn-primary.header-btn-disabled {
  background: #c4b5fd;
  cursor: not-allowed;
  opacity: 0.6;
}

// ============================================
// MAIN CONTENT
// ============================================
.builder-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 65px); // Subtract header height (padding 16px*2 + content ~33px)
  min-height: 0; // Important for flex children to shrink
}

// ============================================
// CONFIG PANEL (LEFT)
// ============================================
.config-panel {
  width: var(--panel-width);
  min-width: 400px;
  max-width: 520px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.panel-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  min-height: 0; // Important for scroll to work in flex container
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-section {
  margin-bottom: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f9fafb;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
  border-radius: 8px 8px 0 0;

  &:hover {
    background: #f3f4f6;
  }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.section-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chevron {
  transition: transform 0.2s;
  color: #6b7280;

  &.rotated {
    transform: rotate(-90deg);
  }
}

.section-content {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

// Type Option (radio style)
.type-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 0;
  user-select: none;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  &.selected {
    border-color: #7c3aed;
    background: #f5f3ff;
  }
}

// Custom Radio Circle
.radio-circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  transition: border-color 0.15s ease;
  flex-shrink: 0;
  box-sizing: border-box;
  background: #fff;
}

.radio-circle .radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.15s ease;
}

.radio-circle.checked {
  border-color: #7c3aed;
}

.radio-circle.checked .radio-dot {
  background-color: #7c3aed;
}

.type-option:hover .radio-circle:not(.checked) {
  border-color: #9ca3af;
}

.option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.option-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

// Upload Field
.upload-field {
  margin-top: 12px;
}

// Slide Down Animation
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease-out;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 300px;
  margin-top: 12px;
  transform: translateY(0);
}

// Fields
.field-group {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.input-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #1a1a1a;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
}

.select-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #1a1a1a;
  background: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
}

.input-with-counter {
  position: relative;

  .input-field {
    padding-right: 60px;
  }

  .char-counter {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 11px;
    color: #9ca3af;
  }
}

.textarea-wrapper {
  position: relative;

  .char-counter {
    position: absolute;
    right: 12px;
    bottom: 12px;
    font-size: 11px;
    color: #9ca3af;
  }
}

.textarea-field {
  width: 100%;
  padding: 12px;
  padding-bottom: 28px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #1a1a1a;
  background: #ffffff;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.5;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
}

// Image Upload
.image-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover, &.dragover {
    border-color: #7c3aed;
    background: #f5f3ff;
  }

  &.has-image {
    padding: 8px;
    border-style: solid;
  }
}

.hidden-input {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #9ca3af;

  span {
    font-size: 13px;
  }
}

.image-preview {
  position: relative;

  img {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 4px;
  }
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(220, 38, 38, 0.9);
  }
}

// Formatting Toolbar
.formatting-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  padding: 4px;
  background: #f9fafb;
  border-radius: 6px;
}

.format-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #374151;
  font-size: 14px;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: #e5e7eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  code {
    font-size: 11px;
  }

  &.has-tooltip {
    position: relative;

    .custom-tooltip {
      position: absolute;
      bottom: calc(100% + 10px);
      left: 0;
      background: #1f2937;
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      // Seta apontando para baixo (alinhada à esquerda)
      &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 16px;
        border: 6px solid transparent;
        border-top-color: #1f2937;
      }
    }

    &:hover .custom-tooltip {
      opacity: 1;
      visibility: visible;
    }
  }
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #d1d5db;
  margin: 0 4px;
}

.variables-dropdown {
  position: relative;
}

.dropdown-menu {
  position: fixed;
  width: 280px;
  max-height: 400px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.25), 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 99999;
  padding: 8px 0;
}

.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dropdown-category {
  padding: 12px 14px 6px;
  font-size: 11px;
  font-weight: 700;
  color: #7c3aed;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 4px;
  background: #faf5ff;
}

.dropdown-category:not(:first-child) {
  margin-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: none;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;

  &:hover {
    background: #f5f3ff;
    color: #7c3aed;
  }

  .variable-value {
    font-size: 10px;
    color: #9ca3af;
    font-family: 'SF Mono', Monaco, Consolas, monospace;
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
  }

  &:hover .variable-value {
    background: #ede9fe;
    color: #7c3aed;
  }
}

// Emoji Dropdown
.emoji-dropdown {
  position: relative;
}

.emoji-menu {
  width: 380px;
  max-height: 380px;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.emoji-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 10px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.emoji-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.15s;
  opacity: 0.6;

  &:hover {
    background: #e5e7eb;
    opacity: 1;
  }

  &.active {
    background: #7c3aed;
    opacity: 1;
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
  }
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 2px;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
}

.emoji-grid::-webkit-scrollbar {
  width: 6px;
}

.emoji-grid::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.emoji-grid::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.emoji-grid::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #f5f3ff;
    transform: scale(1.15);
  }

  &:active {
    transform: scale(0.95);
  }
}

// Buttons Section
.empty-buttons {
  text-align: center;
  padding: 16px;
  color: #9ca3af;

  p {
    margin: 0 0 12px 0;
    font-size: 13px;
  }
}

.btn-add-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  color: #7c3aed;
  border: 1px dashed #7c3aed;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: rgba(124, 58, 237, 0.05);
    border-style: solid;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #7c3aed;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #6d28d9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.buttons-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button-item {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.button-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.button-number {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  color: #dc2626;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: rgba(220, 38, 38, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.button-fields {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

// ============================================
// PREVIEW PANEL (RIGHT)
// ============================================
.preview-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: auto;
  background: var(--builder-bg);
  height: 100%;
  min-width: 0; // Important for flex shrinking
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.phone-frame {
  width: 380px;
  height: 780px;
  background: #1a1a1a;
  border-radius: 44px;
  padding: 14px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  position: relative;
  transform-origin: center center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.phone-notch {
  width: 140px;
  height: 32px;
  background: #1a1a1a;
  border-radius: 0 0 16px 16px;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: #e5ddd5;
  border-radius: 34px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

// WhatsApp Header
.wa-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-top: 36px;
  background: #075e54;
}

.wa-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wa-avatar {
  width: 36px;
  height: 36px;
  background: #128c7e;
  border-radius: 50%;
}

.wa-contact {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
}

// Chat Area with WhatsApp wallpaper pattern
.wa-chat {
  flex: 1 1 0;
  padding: 12px;
  overflow-y: scroll;
  overflow-x: hidden;
  display: block;
  background-color: #efeae2;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  -webkit-overflow-scrolling: touch;
  min-height: 0;
  height: 0;
}

// Custom scrollbar for chat
.wa-chat::-webkit-scrollbar {
  width: 6px;
}

.wa-chat::-webkit-scrollbar-track {
  background: transparent;
}

.wa-chat::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.wa-chat::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.message-bubble {
  max-width: 90%;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13);
  overflow: hidden;
  position: relative;
}

// Sender Header
.message-sender-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  gap: 12px;
}

.sender-name {
  font-size: 13px;
  font-weight: 500;
  color: #1fa855;
}

.sender-phone {
  font-size: 12px;
  color: #667781;
}

.message-image {
  padding: 0 4px;
}

.message-image img {
  width: 100%;
  display: block;
  border-radius: 8px;
}

.message-content {
  padding: 4px 10px 8px;
  position: relative;
  text-align: left;
}

.message-body {
  font-size: 14.2px;
  color: #111b21;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-body.placeholder {
  color: #8696a0;
  font-style: italic;
}

.message-time {
  float: right;
  margin-left: 8px;
  margin-top: 4px;
  font-size: 11px;
  color: #667781;
  position: relative;
  top: 4px;
}

.message-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 85%;
}

.wa-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #00a5f4;
  cursor: default;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

// Input Area
.wa-input-area {
  padding: 8px 16px;
  background: #f0f0f0;
}

.wa-input-placeholder {
  height: 40px;
  background: #ffffff;
  border-radius: 20px;
}

// ============================================
// iOS SMS STYLES
// ============================================

.phone-frame.sms-style {
  background: #000000;
}

.phone-screen.sms-screen {
  background: #ffffff;
}

.sms-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  padding-top: 44px;
  background: #f6f6f6;
  border-bottom: 1px solid #e5e5e5;
}

.sms-header-back {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 60px;
}

.sms-back-count {
  font-size: 17px;
  color: #007AFF;
  font-weight: 400;
}

.sms-header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.sms-avatar {
  width: 56px;
  height: 56px;
  background: #E5E5EA;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.sms-contact-number {
  font-size: 13px;
  color: #000000;
  font-weight: 600;
}

.sms-header-right {
  min-width: 60px;
}

.sms-chat {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sms-timestamp {
  text-align: center;
  font-size: 12px;
  color: #8E8E93;
  margin-bottom: 8px;
}

.sms-bubble {
  max-width: 85%;
  background: #E5E5EA;
  border-radius: 18px;
  padding: 10px 14px;
  align-self: flex-start;
  position: relative;
}

.sms-text {
  font-size: 16px;
  line-height: 1.4;
  color: #000000;
  word-wrap: break-word;

  &.placeholder {
    color: #8E8E93;
    font-style: italic;
  }

  a {
    color: #007AFF;
    text-decoration: none;
  }
}

.sms-input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f6f6f6;
  border-top: 1px solid #e5e5e5;
}

.sms-input-plus {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.sms-input-field {
  flex: 1;
  height: 36px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 12px;

  span {
    font-size: 16px;
    color: #8E8E93;
  }
}

.sms-input-mic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

// ============================================
// RESPONSIVE - Phone Scaling
// ============================================

// Scale phone based on viewport height
@media (max-height: 950px) {
  .phone-frame {
    transform: scale(0.9);
  }
}

@media (max-height: 850px) {
  .phone-frame {
    transform: scale(0.8);
  }
}

@media (max-height: 750px) {
  .phone-frame {
    transform: scale(0.7);
  }
}

@media (max-height: 650px) {
  .phone-frame {
    transform: scale(0.6);
  }
}

@media (max-height: 550px) {
  .phone-frame {
    transform: scale(0.5);
  }
}

// Scale phone based on viewport width (when preview panel is narrow)
@media (max-width: 1400px) and (min-width: 1025px) {
  .phone-frame {
    transform: scale(0.85);
  }
}

@media (max-width: 1200px) and (min-width: 1025px) {
  .phone-frame {
    transform: scale(0.75);
  }
}

// Combined: small height AND narrow width
@media (max-height: 850px) and (max-width: 1400px) and (min-width: 1025px) {
  .phone-frame {
    transform: scale(0.7);
  }
}

@media (max-height: 750px) and (max-width: 1200px) and (min-width: 1025px) {
  .phone-frame {
    transform: scale(0.6);
  }
}

// ============================================
// RESPONSIVE - Layout
// ============================================
@media (max-width: 1024px) {
  .preview-panel {
    display: none;
  }

  .config-panel {
    width: 100% !important;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .builder-header {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }

  .header-left, .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .panel-scroll {
    padding: 16px;
  }

  .builder-content {
    height: calc(100vh - 100px); // Adjust for taller header on mobile
  }
}

// ============================================
// MODALS
// ============================================
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.modal-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 460px;
  margin: 20px;
  padding: 24px 28px;
}

.modal-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
}

.modal-message {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

.modal-message strong {
  color: #1A1A1A;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.modal-btn-cancel {
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.modal-btn-cancel:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.modal-btn-danger {
  background: #b91c1c;
  color: #ffffff;
}

.modal-btn-danger:hover {
  background: #991b1b;
}

.modal-btn-primary {
  background: #7c3aed;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.modal-btn-primary:hover:not(:disabled) {
  background: #6d28d9;
}

.modal-btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.modal-btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

// Button loader spinner
.btn-loader {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: btn-spin 0.8s linear infinite;
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

// ============================================
// LOADER OVERLAY
// ============================================
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(2px);
}

.loader-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  padding: 40px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loader-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: loader-spin 0.8s linear infinite;
}

@keyframes loader-spin {
  to {
    transform: rotate(360deg);
  }
}

.loader-message {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  text-align: center;
}

// Fade transition for modals
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal-container,
.fade-leave-active .modal-container {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.fade-enter-from .modal-container,
.fade-leave-to .modal-container {
  transform: scale(0.95);
  opacity: 0;
}
</style>
// Force rebuild Fri Jan  9 11:06:56 -03 2026
