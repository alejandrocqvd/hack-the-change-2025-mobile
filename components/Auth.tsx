import { Button, Input } from '@rneui/themed'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, AppState, Image, StyleSheet, Text, View } from 'react-native'
import { supabase } from '../lib/supabase'

AppState.addEventListener('change', (state) => {
  state === 'active' ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh()
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) Alert.alert(error.message)
    else router.push('/')
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const { data: { session }, error } = await supabase.auth.signUp({ email, password })
    if (error) Alert.alert(error.message)
    else if (!session) Alert.alert('Account created. You will now be signed in.')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={{ width: 120, height: 120, alignSelf: 'center', marginBottom: 10 }} resizeMode="contain" />
      <Text className="text-2xl font-bold text-center mb-8 text-red-600">Welcome to 312</Text>
      <Input label="Email" leftIcon={{ type: 'font-awesome', name: 'envelope' }} leftIconContainerStyle={{ marginRight: 10 }} onChangeText={setEmail} value={email} placeholder="email@address.com" autoCapitalize="none" />
      <Input label="Password" leftIcon={{ type: 'font-awesome', name: 'lock' }} leftIconContainerStyle={{ marginRight: 10 }} onChangeText={setPassword} value={password} secureTextEntry placeholder="Password" autoCapitalize="none" />
      <Button title="Sign in" disabled={loading} onPress={signInWithEmail} buttonStyle={{ backgroundColor: '#DC2626', borderRadius: 10, marginVertical: 10, padding: 12 }} />
      <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} type="outline" titleStyle={{ color: '#DC2626' }} buttonStyle={{ borderColor: '#DC2626', borderRadius: 10, padding: 12 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' }
})
