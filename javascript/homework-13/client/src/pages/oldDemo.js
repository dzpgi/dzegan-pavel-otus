define(
  [
    'Base/Raiser',
    'Base/View',
    'Lib/Card/Card',
    'Lib/NumberField/NumberField',
    'Lib/Button/Button'
  ],
  function(Raiser, View, Card, NumberField, Button) {
    function PageView(outer) {
      const inner = {
        type: 'confirm_reset_progress_art',
        extend: Raiser.create(View, outer),
        placeIn: '#page_place',
        items: [
          {
            source: Card,
            text: appm.getRouter().getErrorMessage(),
            class: 'error-block',
            incon: 'bolt_fill',
            hidden: !appm. getRouter().getErrorMessage() ? true : false
          },
          {
            source: Card,
            text: appm.getRouter().getContext('art_name'),
            class: 'info-block',
            hidden: !appm. getRouter().getContext('art_name') ? true : false
          },
          {
            source: Card,
            text: 'Вы уверены, что хотите сбросить прогресс приемки по товарной позиции?',
            class: 'command-block',
          },
          {
            source: NumberField,
            id: 'count',
            label: 'Количество:',
            isValid: function() {
              return this.isInteger() && parseInt(this.getValue) > 0
            }
          }
          [
            {
              source: Button,
              text: 'Нет',
              class: 'button button-big button-fill button-raised color-red',
              handler: function() {
                appm.getRouter().move({ wps$direction: 'нет'})
              }
            },
            {
              source: Button,
              text: 'Да',
              class: 'button button-big button-fill button-raised color-green',
              handler: function() {
                const params = inner.getItemValues()
                params.wps$direction = 'да'
                appm.getRouter().move(params)
              }
            }
          ]
        ]
      }
      return inner
    }
  }
)