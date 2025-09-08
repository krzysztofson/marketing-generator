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
      const configuredModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'
      const fallbackModel = 'gpt-4o-mini'
      this.loading = true
      this.error = null

      // If no API key, fall back to a simple local stub for demo purposes
      if (!apiKey) {
        const stub = {
          title: 'Your Marketing Title',
          description: 'A concise, compelling description based on your brief.',
          cta: 'Get Started',
          imageUrl: 'https://picsum.photos/800/800'
        }
        this.setFromJson(stub)
        this.loading = false
        return stub
      }

      try {
        const prompt = `You are a marketing copy generator. Given the following product/company brief, produce ONLY a compact JSON object with these exact keys: title, description, cta, imageUrl from unsplash.com.\n\nBrief:\n${this.brief}\n\nConstraints:\n- Keep title under 70 characters.\n- Description 1-3 sentences.\n- cta is a short call-to-action label.\n- imageUrl ONLY and REAL image URL from unsplash.com.\n- Output JSON only, no markdown, no extra text.`
        const callApi = async (model, useResponseFormat = true) => {
          const body = {
            model,
            temperature: 0.4,
            messages: [
              { role: 'system', content: 'Return strictly valid JSON. No commentary.' },
              { role: 'user', content: prompt }
            ]
          }
          if (useResponseFormat) body.response_format = { type: 'json_object' }

          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
          })

          let errorPayload = null
          if (!res.ok) {
            try {
              errorPayload = await res.json()
            } catch (_) {
              // ignore parse error
            }
            return { ok: false, status: res.status, error: errorPayload }
          }

          const data = await res.json()
          const content = data?.choices?.[0]?.message?.content || '{}'
          return { ok: true, content }
        }

        // Attempt 1: configured model with response_format
        let result = await callApi(configuredModel, true)
        // Attempt 2: fallback model with response_format
        if (!result.ok && result.status === 400) {
          result = await callApi(fallbackModel, true)
        }
        // Attempt 3: fallback model without response_format (some models may not allow it)
        if (!result.ok && result.status === 400) {
          result = await callApi(fallbackModel, false)
        }

        if (!result.ok) {
          const details = result?.error?.error?.message || JSON.stringify(result.error || {})
          throw new Error(`OpenAI API error: ${result.status}${details ? ` - ${details}` : ''}`)
        }

        const content = result.content || '{}'
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

        // Force fixed image URL regardless of model output
        parsed.imageUrl = 'https://picsum.photos/800/800'

        this.setFromJson(parsed)
        return parsed
      } catch (err) {
        console.error(err)
        this.error = err?.message || 'Failed to generate content'
        // Provide a soft fallback so the flow can continue
        let fallback
        if (!this.title && !this.description) {
          fallback = {
            title: 'Sample Campaign',
            description: 'This is a sample description because generation failed.',
            cta: 'Learn More',
            imageUrl: 'https://picsum.photos/800/800'
          }
          this.setFromJson(fallback)
        }
        return (
          fallback || {
            title: this.title,
            description: this.description,
            cta: this.cta,
            imageUrl: this.imageUrl
          }
        )
      } finally {
        this.loading = false
      }
    }
  }
})
