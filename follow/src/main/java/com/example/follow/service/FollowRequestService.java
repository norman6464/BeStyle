package com.example.follow.service;

import com.example.follow.entity.FollowRequest;
import com.example.follow.repository.FollowRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowRequestService {

    private final FollowRequestRepository followRequestRepository;

    /**
     * フォローリクエストを作成
     */
    @Transactional
    public FollowRequest createFollowRequest(Integer requesterId, Integer targetId) {
        Optional<FollowRequest> existingRequest = followRequestRepository.findByRequesterIdAndTargetId(requesterId, targetId);
        if (existingRequest.isPresent()) {
            FollowRequest request = existingRequest.get();
            if ("PENDING".equals(request.getStatus())) {
                throw new IllegalStateException("既にリクエストが送信されています");
            }
            // 再リクエストの場合
            request.setStatus("PENDING");
            return followRequestRepository.save(request);
        }

        FollowRequest followRequest = new FollowRequest();
        followRequest.setRequesterId(requesterId);
        followRequest.setTargetId(targetId);
        followRequest.setStatus("PENDING");

        return followRequestRepository.save(followRequest);
    }

    /**
     * フォローリクエストを承認
     */
    @Transactional
    public FollowRequest acceptFollowRequest(Integer requestId) {
        FollowRequest request = followRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("リクエストが見つかりません"));
        request.setStatus("ACCEPTED");
        return followRequestRepository.save(request);
    }

    /**
     * フォローリクエストを拒否
     */
    @Transactional
    public FollowRequest rejectFollowRequest(Integer requestId) {
        FollowRequest request = followRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("リクエストが見つかりません"));
        request.setStatus("REJECTED");
        return followRequestRepository.save(request);
    }

    /**
     * フォローリクエストを削除
     */
    @Transactional
    public void deleteFollowRequest(Integer requestId) {
        followRequestRepository.deleteById(requestId);
    }

    /**
     * フォローリクエストを取得
     */
    public Optional<FollowRequest> getFollowRequest(Integer requesterId, Integer targetId) {
        return followRequestRepository.findByRequesterIdAndTargetId(requesterId, targetId);
    }

    /**
     * 受信したフォローリクエスト一覧を取得
     */
    public List<FollowRequest> getReceivedFollowRequests(Integer userId) {
        return followRequestRepository.findByTargetIdAndStatus(userId, "PENDING");
    }

    /**
     * 送信したフォローリクエスト一覧を取得
     */
    public List<FollowRequest> getSentFollowRequests(Integer userId) {
        return followRequestRepository.findByRequesterIdAndStatus(userId, "PENDING");
    }

    /**
     * フォローリクエストが存在するか確認
     */
    public boolean hasFollowRequest(Integer requesterId, Integer targetId) {
        return followRequestRepository.existsByRequesterIdAndTargetIdAndStatus(requesterId, targetId, "PENDING");
    }
}
