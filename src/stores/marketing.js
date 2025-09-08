import { defineStore } from 'pinia'

export const useMarketingStore = defineStore('marketing', {
  state: () => ({
    brief: '',
    title: '',
    description: '',
    cta: '',
    imageUrl: '',
    loading: false,
    error: null
  }),
  actions: {
    setBrief(text) {
      this.brief = text
    },
    setFromJson(payload = {}) {
      this.title = payload.title || ''
      this.description = payload.description || ''
      this.cta = payload.cta || ''
      this.imageUrl = payload.imageUrl || ''
    },
    clear() {
      this.title = ''
      this.description = ''
      this.cta = ''
      this.imageUrl = ''
      this.error = null
    },
    async generateFromBrief() {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      this.loading = true
      this.error = null

      // If no API key, fall back to a simple local stub for demo purposes
      if (!apiKey) {
        this.setFromJson({
          title: 'Your Marketing Title',
          description: 'A concise, compelling description based on your brief.',
          cta: 'Get Started',
          imageUrl: 'https://picsum.photos/800/800?blur=2'
        })
        this.loading = false
        return
      }

      try {
        const prompt = `You are a marketing copy generator. Given the following product/company brief, produce ONLY a compact JSON object with these exact keys: title, description, cta, imageUrl.\n\nBrief:\n${this.brief}\n\nConstraints:\n- Keep title under 70 characters.\n- Description 1-3 sentences.\n- cta is a short call-to-action label.\n- imageUrl should be a reasonable stock-like image URL (can be a generic placeholder).\n- Output JSON only, no markdown, no extra text.`

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.4,
            messages: [
              { role: 'system', content: 'Return strictly valid JSON. No commentary.' },
              { role: 'user', content: prompt }
            ],
            // If supported, nudge for JSON output (ignored by older models)
            response_format: { type: 'json_object' }
          })
        })

        if (!res.ok) {
          throw new Error(`OpenAI API error: ${res.status}`)
        }

        const data = await res.json()
        const content = data?.choices?.[0]?.message?.content || '{}'
        let parsed
        try {
          parsed = JSON.parse(content)
        } catch (e) {
          // Try to salvage JSON if any extra chars slipped in
          const match = content.match(/\{[\s\S]*\}/)
          parsed = match ? JSON.parse(match[0]) : {}
        }

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON returned from model')
        }

        this.setFromJson(parsed)
      } catch (err) {
        console.error(err)
        this.error = err?.message || 'Failed to generate content'
        // Provide a soft fallback so the flow can continue
        if (!this.title && !this.description) {
          this.setFromJson({
            title: 'Sample Campaign',
            description: 'This is a sample description because generation failed.',
            cta: 'Learn More',
            imageUrl: 'https://picsum.photos/800/800'
          })
        }
      } finally {
        this.loading = false
      }
    }
  }
})
