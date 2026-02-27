export default {
  editor: {
    label: {
      en: 'WhatsApp Template Builder',
      pt: 'Construtor de Template WhatsApp',
    },
    icon: 'message-square',
  },

  // ============================================
  // INTERNAL VARIABLES
  // ============================================
  variables: [
    {
      name: 'templateName',
      value: 'Novo Template',
      type: 'string',
      label: { en: 'Template Name', pt: 'Nome do Template' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Current name of the template (editable in header)',
      },
      /* wwEditor:end */
    },
    {
      name: 'headerType',
      value: 'none',
      type: 'string',
      label: { en: 'Header Type', pt: 'Tipo do Header' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Type of header: none, text, image',
      },
      /* wwEditor:end */
    },
    {
      name: 'headerContent',
      value: '',
      type: 'string',
      label: { en: 'Header Content', pt: 'Conteudo do Header' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Text content of the header (when type is text)',
      },
      /* wwEditor:end */
    },
    {
      name: 'headerImageUrl',
      value: '',
      type: 'string',
      label: { en: 'Header Image URL', pt: 'URL da Imagem do Header' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'URL of the header image (when type is image)',
      },
      /* wwEditor:end */
    },
    {
      name: 'bodyContent',
      value: '',
      type: 'string',
      label: { en: 'Body Content', pt: 'Conteudo do Body' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Main message body content',
      },
      /* wwEditor:end */
    },
    {
      name: 'footerContent',
      value: '',
      type: 'string',
      label: { en: 'Footer Content', pt: 'Conteudo do Footer' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Footer text content',
      },
      /* wwEditor:end */
    },
    {
      name: 'buttons',
      value: [],
      type: 'array',
      label: { en: 'Buttons', pt: 'Botoes' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Array of button objects',
      },
      /* wwEditor:end */
    },
    {
      name: 'variables',
      value: [],
      type: 'array',
      label: { en: 'Variables', pt: 'Variaveis' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Array of variables used in the template',
      },
      /* wwEditor:end */
    },
    {
      name: 'isValid',
      value: false,
      type: 'boolean',
      label: { en: 'Is Valid', pt: 'E Valido' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Indicates whether the template is valid for saving',
      },
      /* wwEditor:end */
    },
    {
      name: 'validationErrors',
      value: [],
      type: 'array',
      label: { en: 'Validation Errors', pt: 'Erros de Validacao' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Array of validation error messages',
      },
      /* wwEditor:end */
    },
    {
      name: 'loadedTemplateId',
      value: null,
      type: 'number',
      label: { en: 'Loaded Template ID', pt: 'ID do Template Carregado' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'ID of the template being edited (null for new)',
      },
      /* wwEditor:end */
    },
    {
      name: 'isDirty',
      value: false,
      type: 'boolean',
      label: { en: 'Has Unsaved Changes', pt: 'Tem Alteracoes Nao Salvas' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'True if there are unsaved changes',
      },
      /* wwEditor:end */
    },
    {
      name: 'bodyCharCount',
      value: 0,
      type: 'number',
      label: { en: 'Body Character Count', pt: 'Contagem de Caracteres do Body' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Current character count of the body content',
      },
      /* wwEditor:end */
    },
    {
      name: 'headerCharCount',
      value: 0,
      type: 'number',
      label: { en: 'Header Character Count', pt: 'Contagem de Caracteres do Header' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Current character count of the header content',
      },
      /* wwEditor:end */
    },
  ],

  // ============================================
  // TRIGGER EVENTS
  // ============================================
  triggerEvents: [
    {
      name: 'back',
      label: { en: 'On back click', pt: 'Ao clicar em voltar' },
      event: {},
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when the back button is clicked',
      },
      /* wwEditor:end */
    },
    {
      name: 'load',
      label: { en: 'On template load', pt: 'Ao carregar template' },
      event: {
        success: true,
        template: {},
      },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Disparado quando um template existente é carregado para edição (via querystring id)',
      },
      /* wwEditor:end */
    },
    {
      name: 'load-error',
      label: { en: 'On template load error', pt: 'Ao erro de carregamento' },
      event: {
        error: '',
        templateId: null,
      },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Disparado quando ocorre erro ao carregar template existente',
      },
      /* wwEditor:end */
    },
    {
      name: 'save',
      label: { en: 'On save', pt: 'Ao salvar' },
      event: {
        success: false,
        message: '',
        error: '',
        template: {},
        templateId: null,
      },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Disparado após tentativa de salvar. Use success para verificar resultado.',
      },
      /* wwEditor:end */
    },
    {
      name: 'save-complete',
      label: { en: 'On save complete', pt: 'Ao completar salvamento' },
      event: {
        templateId: null,
      },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Disparado após o salvamento bem-sucedido. Use para redirecionar para página de templates.',
      },
      /* wwEditor:end */
    },
    {
      name: 'content-change',
      label: { en: 'On content change', pt: 'Ao alterar conteudo' },
      event: {
        field: '',
        value: '',
        template: {},
      },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when any content field changes',
      },
      /* wwEditor:end */
    },
    {
      name: 'template-name-change',
      label: { en: 'On template name change', pt: 'Ao mudar nome do template' },
      event: { oldName: '', newName: '' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when the template name is edited',
      },
      /* wwEditor:end */
    },
    {
      name: 'validation-change',
      label: { en: 'On validation change', pt: 'Ao alterar validacao' },
      event: { isValid: false, errors: [] },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when validation status changes',
      },
      /* wwEditor:end */
    },
    {
      name: 'image-upload',
      label: { en: 'On image upload', pt: 'Ao fazer upload de imagem' },
      event: { url: '', file: null },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when an image is uploaded for the header',
      },
      /* wwEditor:end */
    },
    {
      name: 'variable-insert',
      label: { en: 'On variable insert', pt: 'Ao inserir variavel' },
      event: { variable: '', field: '' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when a variable is inserted into content',
      },
      /* wwEditor:end */
    },
    {
      name: 'emoji-insert',
      label: { en: 'On emoji insert', pt: 'Ao inserir emoji' },
      event: { emoji: '', field: '' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when an emoji is inserted into content',
      },
      /* wwEditor:end */
    },
    {
      name: 'button-add',
      label: { en: 'On button add', pt: 'Ao adicionar botao' },
      event: { button: {} },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when a button is added',
      },
      /* wwEditor:end */
    },
    {
      name: 'button-remove',
      label: { en: 'On button remove', pt: 'Ao remover botao' },
      event: { buttonId: '' },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when a button is removed',
      },
      /* wwEditor:end */
    },
    {
      name: 'template-loaded',
      label: { en: 'On template loaded', pt: 'Ao carregar template' },
      event: { template: {} },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when a template is loaded for editing',
      },
      /* wwEditor:end */
    },
    {
      name: 'load-error',
      label: { en: 'On load error', pt: 'Erro ao carregar' },
      event: { error: '', templateId: null },
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Triggered when there is an error loading a template',
      },
      /* wwEditor:end */
    },
  ],

  // ============================================
  // PROPERTIES
  // ============================================
  properties: {
    // ----------------------------------------
    // Template Data
    // ----------------------------------------
    templateId: {
      label: { en: 'Template ID', pt: 'ID do Template' },
      type: 'Number',
      section: 'settings',
      bindable: true,
      defaultValue: null,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'ID of the template being edited (null for new)',
      },
      propertyHelp: {
        tooltip: 'Set to the template ID when editing, or leave null for new',
      },
      /* wwEditor:end */
    },
    empresaId: {
      label: { en: 'Empresa ID', pt: 'ID da Empresa' },
      type: 'Number',
      section: 'settings',
      bindable: true,
      defaultValue: null,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'ID da empresa para salvar o template',
      },
      propertyHelp: {
        tooltip: 'ID da empresa necessário para salvar o template no banco de dados',
      },
      /* wwEditor:end */
    },
    templateName: {
      label: { en: 'Template Name', pt: 'Nome do Template' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Novo Template',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Name of the template displayed in the header',
      },
      propertyHelp: {
        tooltip: 'The name of the template shown in the header bar',
      },
      /* wwEditor:end */
    },

    logoUrl: {
      label: { en: 'Logo', pt: 'Logo' },
      type: 'Image',
      section: 'settings',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Logo image for the header',
      },
      propertyHelp: {
        tooltip: 'Upload or select a logo image to display in the header',
      },
      /* wwEditor:end */
    },

    // ----------------------------------------
    // Initial Content
    // ----------------------------------------
    initialHeaderType: {
      label: { en: 'Initial Header Type', pt: 'Tipo de Header Inicial' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'none', label: 'Nenhum' },
          { value: 'text', label: 'Texto' },
          { value: 'image', label: 'Imagem' },
        ],
      },
      defaultValue: 'none',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Initial header type: none | text | image',
      },
      /* wwEditor:end */
    },

    initialHeaderContent: {
      label: { en: 'Initial Header Content', pt: 'Conteudo Header Inicial' },
      type: 'Text',
      section: 'settings',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Initial header text content',
      },
      /* wwEditor:end */
    },

    initialHeaderImageUrl: {
      label: { en: 'Initial Header Image', pt: 'Imagem Header Inicial' },
      type: 'Image',
      section: 'settings',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Initial header image URL',
      },
      /* wwEditor:end */
    },

    initialBodyContent: {
      label: { en: 'Initial Body Content', pt: 'Conteudo Body Inicial' },
      type: 'Text',
      section: 'settings',
      defaultValue: '',
      bindable: true,
      options: {
        multiline: true,
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Initial body text content',
      },
      /* wwEditor:end */
    },

    initialFooterContent: {
      label: { en: 'Initial Footer Content', pt: 'Conteudo Footer Inicial' },
      type: 'Text',
      section: 'settings',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Initial footer text content',
      },
      /* wwEditor:end */
    },

    initialButtons: {
      label: { en: 'Initial Buttons', pt: 'Botoes Iniciais' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item?.text || `Botao ${item?.id || 'Unknown'}`
        },
        item: {
          type: 'Object',
          defaultValue: { id: 'btn_1', type: 'quick_reply', text: 'Botao' },
          options: {
            item: {
              id: { label: { en: 'ID' }, type: 'Text' },
              type: {
                label: { en: 'Type', pt: 'Tipo' },
                type: 'TextSelect',
                options: {
                  options: [
                    { value: 'quick_reply', label: 'Resposta Rapida' },
                    { value: 'url', label: 'URL' },
                    { value: 'phone', label: 'Telefone' },
                  ],
                },
              },
              text: { label: { en: 'Text', pt: 'Texto' }, type: 'Text' },
              url: { label: { en: 'URL' }, type: 'Text' },
              phone: { label: { en: 'Phone', pt: 'Telefone' }, type: 'Text' },
            },
          },
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of button objects',
      },
      /* wwEditor:end */
    },

    // ----------------------------------------
    // Available Variables
    // ----------------------------------------
    availableVariables: {
      label: { en: 'Available Variables', pt: 'Variaveis Disponiveis' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
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
        // Carrinho Abandonado
        { value: '{{carrinho_total}}', label: 'Total do Carrinho', category: 'Carrinho Abandonado' },
        { value: '{{carrinho_url}}', label: 'Link de Recuperacao', category: 'Carrinho Abandonado' },
        { value: '{{carrinho_qtd_itens}}', label: 'Qtd Itens', category: 'Carrinho Abandonado' },
        { value: '{{produtos_carrinho}}', label: 'Lista de Produtos', category: 'Carrinho Abandonado' },
        { value: '{{carrinho_frete}}', label: 'Frete', category: 'Carrinho Abandonado' },
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item?.label || item?.value || 'Variavel'
        },
        item: {
          type: 'Object',
          defaultValue: { value: '{{variavel}}', label: 'Variavel' },
          options: {
            item: {
              value: { label: { en: 'Value' }, type: 'Text' },
              label: { label: { en: 'Label' }, type: 'Text' },
            },
          },
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of available variables for insertion',
      },
      propertyHelp: {
        tooltip: 'Variables users can insert into the template body',
      },
      /* wwEditor:end */
    },

    // ----------------------------------------
    // Limits
    // ----------------------------------------
    maxBodyLength: {
      label: { en: 'Max Body Length', pt: 'Tamanho Maximo do Body' },
      type: 'Number',
      section: 'settings',
      defaultValue: 1024,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Maximum characters allowed in body',
      },
      /* wwEditor:end */
    },

    maxHeaderLength: {
      label: { en: 'Max Header Length', pt: 'Tamanho Maximo do Header' },
      type: 'Number',
      section: 'settings',
      defaultValue: 60,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Maximum characters allowed in header',
      },
      /* wwEditor:end */
    },

    maxFooterLength: {
      label: { en: 'Max Footer Length', pt: 'Tamanho Maximo do Footer' },
      type: 'Number',
      section: 'settings',
      defaultValue: 60,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Maximum characters allowed in footer',
      },
      /* wwEditor:end */
    },

    maxButtons: {
      label: { en: 'Max Buttons', pt: 'Maximo de Botoes' },
      type: 'Number',
      section: 'settings',
      defaultValue: 3,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Maximum number of buttons allowed',
      },
      /* wwEditor:end */
    },

    // ----------------------------------------
    // Container Settings
    // ----------------------------------------
    height: {
      label: { en: 'Height', pt: 'Altura' },
      type: 'Length',
      section: 'settings',
      defaultValue: '100vh',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Height of the builder container',
      },
      /* wwEditor:end */
    },

    backgroundColor: {
      label: { en: 'Background Color', pt: 'Cor de Fundo' },
      type: 'Color',
      section: 'style',
      defaultValue: '#f8fafc',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Background color of the builder',
      },
      /* wwEditor:end */
    },

    // ----------------------------------------
    // Panel Settings
    // ----------------------------------------
    panelWidth: {
      label: { en: 'Panel Width', pt: 'Largura do Painel' },
      type: 'Length',
      section: 'style',
      defaultValue: '460px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Width of the left configuration panel',
      },
      /* wwEditor:end */
    },

    showPreview: {
      label: { en: 'Show Preview', pt: 'Mostrar Preview' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show/hide the phone preview',
      },
      /* wwEditor:end */
    },

    // ----------------------------------------
    // Read Only Mode
    // ----------------------------------------
    readOnly: {
      label: { en: 'Read Only', pt: 'Somente Leitura' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Enable read-only mode (view only)',
      },
      /* wwEditor:end */
    },
  },
}
