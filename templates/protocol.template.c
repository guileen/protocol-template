#ifndef GEN_PROTOCOL_TEMPLATE_H
#define GEN_PROTOCOL_TEMPLATE_H

{% for protocol in protocols -%}
#define PROTOCOL_{{ protocol[0].upper().replace('-', '_') }} {{ loop.index }}
{% endfor %}

#endif
