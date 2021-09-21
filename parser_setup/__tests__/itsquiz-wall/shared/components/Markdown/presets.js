export const activationDescriptionPreset =  {
    options: {
        html        : false,
        xhtmlOut    : false,
        breaks      : false,
        langPrefix  : 'language-',
        linkify     : true,
        typographer : false,
        quotes      : '\u201c\u201d\u2018\u2019',
        highlight   : null,
        maxNesting  : 20
    },

    components: {
        core: {
            rules: [
                'normalize',
                'block',
                'inline'
            ]
        },

        block: {
            rules: [
                'paragraph'
            ]
        },

        inline: {
            rules: [
                'text'
            ],
            rules2: [
                'balance_pairs',
                'text_collapse'
            ]
        }
    }
};
